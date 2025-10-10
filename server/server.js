import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from './models/User.js';
import process from "node:process";
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';

dotenv.config();

import authRoutes from './routes/auth.js';
import leaderboardRoutes from './routes/leaderboard.js';

// Configure passport here after dotenv
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Configure GitHub strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  console.log('Registering GitHub strategy...');
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL || 'http://localhost:3001'}/auth/github/callback`
  }, async (_accessToken, _refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ githubId: profile.id });

      if (user) {
        user.username = profile.username;
        user.displayName = profile.displayName || profile.username;
        user.profileUrl = profile.profileUrl;
        user.avatarUrl = profile.photos ? profile.photos[0].value : null;
        await user.save();
        return done(null, user);
      } else {
        user = new User({
          githubId: profile.id,
          username: profile.username,
          displayName: profile.displayName || profile.username,
          profileUrl: profile.profileUrl,
          avatarUrl: profile.photos ? profile.photos[0].value : null
        });

        await user.save();
        return done(null, user);
      }
    } catch (error) {
      return done(error, null);
    }
  }));
  console.log('GitHub strategy registered successfully');
} else {
  console.error('GitHub OAuth credentials not found!');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'bad_pizza_sad_pizza_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/bad-pizza-sad-pizza'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check route
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, '..', 'dist');
const indexHtmlPath = path.join(clientDistPath, 'index.html');

if (fs.existsSync(indexHtmlPath)) {
  app.use(express.static(clientDistPath));

  app.use((req, res) => {
    res.sendFile(indexHtmlPath, (err) => {
      if (err) {
        console.error('Error sending index.html:', err);
        res.status(500).send('Server error while serving client.');
      }
    });
  });
} else {
  console.warn('Client build not found at', indexHtmlPath);
  app.use((_req, res) => {
    res.status(404).send('Client not built. Please run npm run build in the repo root.');
  });
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bad-pizza-sad-pizza')
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
    });