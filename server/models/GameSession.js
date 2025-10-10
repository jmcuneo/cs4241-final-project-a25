import mongoose from 'mongoose';

const gameSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  pizzasSold: {
    type: Number,
    required: true
  },
  revenue: {
    type: Number,
    required: true
  },
  gameTime: {
    type: Number, // in seconds
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('GameSession', gameSessionSchema);