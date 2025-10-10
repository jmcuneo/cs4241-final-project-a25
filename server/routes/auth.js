import express from 'express';
import passport from 'passport';
import process from "node:process";
const router = express.Router();

// GitHub authentication route
router.get('/github', passport.authenticate('github'));

// GitHub callback route
router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  (_req, res) => {
    // Successful authentication, redirect to game
    res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Could not destroy session' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  });
});

// Get current user
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      user: {
        id: req.user._id,
        githubId: req.user.githubId,
        username: req.user.username,
        displayName: req.user.displayName,
        avatarUrl: req.user.avatarUrl
      }
    });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

export default router;