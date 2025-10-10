const mongoose = require('mongoose');

const BetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventId: {
        type: String,
        required: true
    },
    eventName: {
        type: String,
        required: true
    },
    betType: {
        type: String,
        required: true,
        enum: ['moneyline', 'spread', 'total']
    },
    selection: {
        type: String,
        required: true
    },
    odds: {
        type: Number,
        required: true
    },
    stake: {
        type: Number,
        required: true,
        min: 1
    },
    potentialWin: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'won', 'lost'],
        default: 'pending'
    },
    placedAt: {
        type: Date,
        default: Date.now
    },
    settledAt: {
        type: Date
    }
});

module.exports = mongoose.model('Bet', BetSchema);