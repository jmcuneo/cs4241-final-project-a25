const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = process.env.ODDS_API_KEY;
const BASE_URL = 'https://api.the-odds-api.com/v4';




router.get('/', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/sports/basketball_nba/odds`, {
            params: {
                apiKey: API_KEY,
                regions: 'us',
                markets: 'h2h,spreads,totals',
                oddsFormat: 'american',
                dateFormat: 'iso'
            }
        });

        console.log(`Remaining API requests: ${response.headers['x-requests-remaining']}`);

        const events = response.data.map(event => {
            const fanduel = event.bookmakers.find(bookmaker => bookmaker.key === 'fanduel');

            const bookmaker = fanduel || (event.bookmakers.length > 0 ? event.bookmakers[0] : null);

            if (!bookmaker) {
                return null;
            }

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

        res.json(events);
    } catch (error) {
        console.error('Error fetching NBA odds from The Odds API:', error.message);

        const mockEvents = [
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
            },
            {
                id: 'nba3',
                name: 'Phoenix Suns @ Denver Nuggets',
                sport: 'NBA Basketball',
                date: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
                bookmaker: 'FanDuel',
                odds: {
                    moneyline: [
                        { team: 'Phoenix Suns', odds: +180 },
                        { team: 'Denver Nuggets', odds: -220 }
                    ],
                    spread: [
                        { team: 'Phoenix Suns', spread: +5.5, odds: -110 },
                        { team: 'Denver Nuggets', spread: -5.5, odds: -110 }
                    ],
                    total: [
                        { type: 'Over', points: 228.0, odds: -110 },
                        { type: 'Under', points: 228.0, odds: -110 }
                    ]
                }
            }
        ];

        res.json(mockEvents);
    }
});

router.get('/:sport', async (req, res) => {
    const { sport } = req.params;
    const sportMap = {
        'nba': 'basketball_nba',
        'ncaab': 'basketball_ncaab',
        'nfl': 'americanfootball_nfl',
        'nhl': 'icehockey_nhl'
    };

    const apiSport = sportMap[sport] || sport;

    try {
        const response = await axios.get(`${BASE_URL}/sports/${apiSport}/odds`, {
            params: {
                apiKey: API_KEY,
                regions: 'us',
                markets: 'h2h,spreads,totals',
                oddsFormat: 'american'
            }
        });




        const events = response.data.map(event => {
            const fanduel = event.bookmakers.find(bookmaker => bookmaker.key === 'fanduel');
            const bookmaker = fanduel || (event.bookmakers.length > 0 ? event.bookmakers[0] : null);

            if (!bookmaker) return null;

            return {
                id: event.id,
                name: `${event.away_team} @ ${event.home_team}`,
                sport: sport.toUpperCase(),
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

        res.json(events);
    } catch (error) {
        console.error(`Error fetching ${sport} odds:`, error.message);
        res.status(500).json({ message: 'Error fetching odds data' });
    }
});


module.exports = router;