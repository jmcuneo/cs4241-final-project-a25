const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = process.env.ODDS_API_KEY;
const BASE_URL = 'https://api.the-odds-api.com/v4';

const enhancedMockEvents = [
    {
        id: 'nba1',
        name: 'Los Angeles Lakers @ Golden State Warriors',
        sport: 'NBA Basketball',
        date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        bookmaker: 'FanDuel',
        odds: {
            moneyline: [
                { team: 'Los Angeles Lakers', odds: -150 },
                { team: 'Golden State Warriors', odds: +130 }
            ],
            spread: [
                { team: 'Los Angeles Lakers', spread: -3.5, odds: -110 },
                { team: 'Golden State Warriors', spread: +3.5, odds: -110 }
            ],
            total: [
                { type: 'Over', points: 225.5, odds: -110 },
                { type: 'Under', points: 225.5, odds: -110 }
            ]
        }
    },
    {
        id: 'nba2',
        name: 'Boston Celtics @ Milwaukee Bucks',
        sport: 'NBA Basketball',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        bookmaker: 'FanDuel',
        odds: {
            moneyline: [
                { team: 'Boston Celtics', odds: -120 },
                { team: 'Milwaukee Bucks', odds: +100 }
            ],
            spread: [
                { team: 'Boston Celtics', spread: -2.5, odds: -110 },
                { team: 'Milwaukee Bucks', spread: +2.5, odds: -110 }
            ],
            total: [
                { type: 'Over', points: 232.5, odds: -110 },
                { type: 'Under', points: 232.5, odds: -110 }
            ]
        }
    }
];

router.get('/', async (req, res) => {
    try {
        if (!API_KEY || API_KEY === '1fab61de77270fb23d28dc6401ce25ea') {
            return res.json(enhancedMockEvents);
        }

        const response = await axios.get(`${BASE_URL}/sports/basketball_nba/odds`, {
            params: {
                apiKey: API_KEY,
                regions: 'us',
                markets: 'h2h,spreads,totals',
                oddsFormat: 'american'
            },
            timeout: 10000
        });

        const events = response.data.map(event => {
            const fanduel = event.bookmakers.find(bookmaker => bookmaker.key === 'fanduel');
            const bookmaker = fanduel || (event.bookmakers.length > 0 ? event.bookmakers[0] : null);

            if (!bookmaker) return null;

            return {
                id: event.id,
                name: `${event.away_team} @ ${event.home_team}`,
                sport: 'NBA Basketball',
                date: event.commence_time,
                bookmaker: bookmaker.title,
                odds: {
                    moneyline: bookmaker.markets.find(m => m.key === 'h2h')?.outcomes.map(outcome => ({
                        team: outcome.name,
                        odds: outcome.price
                    })) || [],
                    spread: bookmaker.markets.find(m => m.key === 'spreads')?.outcomes.map(outcome => ({
                        team: outcome.name,
                        spread: outcome.point,
                        odds: outcome.price
                    })) || [],
                    total: bookmaker.markets.find(m => m.key === 'totals')?.outcomes.map(outcome => ({
                        type: outcome.name,
                        points: outcome.point,
                        odds: outcome.price
                    })) || []
                }
            };
        }).filter(event => event !== null);

        res.json(events.length > 0 ? events : enhancedMockEvents);

    } catch (error) {
        res.json(enhancedMockEvents);
    }
});

module.exports = router;