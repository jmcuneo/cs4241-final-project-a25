import GameSession from '../models/GameSession.js';
import User from '../models/User.js';

// Get leaderboard (top 10 players by revenue)
async function getLeaderboard(_req, res) {
  try {
    const leaderboard = await GameSession.find()
      .sort({ revenue: -1 })
      .limit(10)
      .select('username pizzasSold revenue createdAt');
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
}

// Save game session
async function saveGameSession(req, res) {
  try {
    const { userId, username, pizzasSold, revenue, gameTime } = req.body;
    
    // Validate required fields
    if (!userId || !username || pizzasSold === undefined || revenue === undefined || !gameTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create new game session
    const gameSession = new GameSession({
      userId,
      username,
      pizzasSold,
      revenue,
      gameTime
    });
    
    await gameSession.save();
    
    // Update user stats
    const user = await User.findById(userId);
    if (user) {
      user.pizzasSold += pizzasSold;
      user.revenue += revenue;
      await user.save();
    }
    
    res.status(201).json({ message: 'Game session saved successfully', gameSession });
  } catch (error) {
    console.error('Error saving game session:', error);
    res.status(500).json({ error: 'Failed to save game session' });
  }
}

export { getLeaderboard, saveGameSession };