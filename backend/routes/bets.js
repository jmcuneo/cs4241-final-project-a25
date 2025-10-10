const express = require('express');
const Bet = require('../models/Bet');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const bets = await Bet.find({ user: req.user._id }).sort({ placedAt: -1 });
        res.json(bets);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { eventId, eventName, betType, selection, odds, stake } = req.body;

        if (req.user.balance < stake) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        let potentialWin;
        if (odds > 0) {
            potentialWin = stake * (odds / 100);
        } else {
            potentialWin = stake * (100 / Math.abs(odds));
        }
        potentialWin = Math.round(potentialWin * 100) / 100;

        const bet = new Bet({
            user: req.user._id,
            eventId,
            eventName,
            betType,
            selection,
            odds,
            stake,
            potentialWin
        });

        await User.findByIdAndUpdate(req.user._id, {
            $inc: { balance: -stake }
        });

        await bet.save();

        const updatedUser = await User.findById(req.user._id).select('-password');

        res.status(201).json({
            bet,
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;