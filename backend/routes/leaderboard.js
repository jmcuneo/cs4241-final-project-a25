const express = require('express');
const User = require('../models/User');
const Bet = require('../models/Bet');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find({})
            .select('username balance')
            .sort({ balance: -1 })
            .limit(20);

        const leaderboard = await Promise.all(
            users.map(async (user) => {
                const userBets = await Bet.find({ user: user._id });
                const totalBets = userBets.length;
                const wonBets = userBets.filter(bet => bet.status === 'won').length;
                const lostBets = userBets.filter(bet => bet.status === 'lost').length;
                const pendingBets = userBets.filter(bet => bet.status === 'pending').length;

                const totalWagered = userBets.reduce((sum, bet) => sum + bet.stake, 0);
                const netProfit = user.balance - 1000;

                return {
                    username: user.username,
                    balance: user.balance,
                    netProfit: netProfit,
                    totalBets: totalBets,
                    wonBets: wonBets,
                    lostBets: lostBets,
                    pendingBets: pendingBets,
                    totalWagered: totalWagered,
                    winRate: totalBets > 0 ? (wonBets / totalBets * 100).toFixed(1) : 0
                };
            })
        );

        res.json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Server error fetching leaderboard' });
    }
});

module.exports = router;