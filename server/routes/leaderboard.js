import express from 'express';
import { getLeaderboard, saveGameSession } from '../controllers/leaderboardController.js';
const router = express.Router();

// Get leaderboard (top 10 players by revenue)
router.get('/', getLeaderboard);

// Save game session
router.post('/save', saveGameSession);

export default router;