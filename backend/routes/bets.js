const express = require('express');
const Bet = require('../models/Bet');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        console.log('Fetching bets for user:', req.user._id);
        const bets = await Bet.find({ user: req.user._id }).sort({ placedAt: -1 });
        console.log(`Found ${bets.length} bets for user`);
        res.json(bets);
    } catch (error) {
        console.error('Error fetching bets:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        console.log('Placing new bet for user:', req.user.username);
        console.log('Bet data:', req.body);

        const { eventId, eventName, betType, selection, odds, stake } = req.body;

        if (!eventId || !eventName || !betType || !selection || !odds || !stake) {
            console.log('Missing required fields');
            return res.status(400).json({
                message: 'Missing required fields',
                required: ['eventId', 'eventName', 'betType', 'selection', 'odds', 'stake'],
                received: req.body
            });
        }

        const stakeAmount = parseFloat(stake);
        if (isNaN(stakeAmount) || stakeAmount < 1) {
            return res.status(400).json({ message: 'Invalid stake amount' });
        }

        if (req.user.balance < stakeAmount) {
            console.log(`Insufficient balance: ${req.user.balance} < ${stakeAmount}`);
            return res.status(400).json({
                message: 'Insufficient balance',
                currentBalance: req.user.balance,
                requiredStake: stakeAmount
            });
        }

        let potentialWin;
        if (odds > 0) {
            potentialWin = stakeAmount * (odds / 100);
        } else {
            potentialWin = stakeAmount * (100 / Math.abs(odds));
        }
        potentialWin = Math.round(potentialWin * 100) / 100;

        console.log(`Potential win calculated: $${potentialWin}`);

        const bet = new Bet({
            user: req.user._id,
            eventId,
            eventName,
            betType,
            selection,
            odds,
            stake: stakeAmount,
            potentialWin
        });

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $inc: { balance: -stakeAmount } },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            console.log('User not found during balance update');
            return res.status(404).json({ message: 'User not found' });
        }

        await bet.save();
        console.log('Bet placed successfully:', bet._id);

        res.status(201).json({
            bet,
            user: updatedUser
        });

    } catch (error) {
        console.error('Error placing bet:', error);
        res.status(500).json({
            message: 'Server error placing bet',
            error: error.message
        });
    }
});

module.exports = router;