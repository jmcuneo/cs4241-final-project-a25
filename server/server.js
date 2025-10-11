import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import passport from 'passport';

import { configureAuth } from './auth.js';
import meRoute from './routes/me.js';
import favRoute from './routes/favorites.js';
import alertsRoute from './routes/alerts.js';
import { cspDirectives } from './utils/csp.js';
import { initWS } from './ws.js';
import { fetchPredictionsByStop, fetchRouteShapes, fetchStops } from './mbta.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const CLIENT_DIST = path.join(__dirname, '..', 'client', 'dist');

mongoose.set('strictQuery', true);
await mongoose.connect(process.env.MONGODB_URI);

// trust proxy for secure cookies on render/heroku
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);

app.use(helmet({ contentSecurityPolicy: { useDefaults: true, directives: cspDirectives } }));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
}));

app.use(passport.initialize());
app.use(passport.session());
configureAuth(app);

// lightweight API
app.get('/api/ping', (_, res) => res.json({ ok: true }));
app.use('/api/me', meRoute);
app.use('/api/favorites', favRoute);
app.use('/api/alerts', alertsRoute);

app.get('/api/listStops', async (req, res) => {
  try {
    const data = await fetchStops();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// predictions by stop
app.get('/api/predictions/:stopId', async (req, res) => {
  try {
    const data = await fetchPredictionsByStop(req.params.stopId);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// shapes by route
app.get('/api/shapes/:route', async (req, res) => {
  try {
    const data = await fetchRouteShapes(req.params.route);
    res.json(data.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// serve client build in prod
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(CLIENT_DIST));
  app.get('*', (_, res) => res.sendFile(path.join(CLIENT_DIST, 'index.html')));
}

const server = app.listen(PORT, () => {
  console.log(`server on :${PORT}`);
});

initWS(server);
