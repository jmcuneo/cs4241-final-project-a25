# Backend Server for Bad Pizza, Sad Pizza

This directory contains the backend server implementation for the Bad Pizza, Sad Pizza game.

## Technologies Used

- **Express.js**: Web framework for Node.js
- **MongoDB/Mongoose**: Database for persistent storage
- **Passport.js**: Authentication middleware
- **GitHub OAuth**: User authentication via GitHub
- **Express Session**: Session management
- **Connect Mongo**: MongoDB session store

## Project Structure

```
server/
├── server.js          # Entry point
├── models/            # Database models
│   ├── User.js        # User schema
│   └── GameSession.js # Game session schema
├── routes/            # API routes
│   ├── auth.js        # Authentication routes
│   └── leaderboard.js # Leaderboard routes
├── controllers/       # Route handlers
│   └── leaderboardController.js
├── config/            # Configuration files
│   └── passport.js    # Passport configuration
└── README.md          # This file
```

## API Endpoints

### Authentication
- `GET /auth/github` - Initiate GitHub OAuth
- `GET /auth/github/callback` - GitHub OAuth callback
- `GET /auth/logout` - Log out user
- `GET /auth/user` - Get current user info

### Leaderboard
- `GET /api/leaderboard` - Get top 10 players
- `POST /api/leaderboard/save` - Save game session

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables in `.env`:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

3. Start the server:
   ```
   npm run server
   ```

4. For development with auto-reload:
   ```
   npm run dev:server
   ```
