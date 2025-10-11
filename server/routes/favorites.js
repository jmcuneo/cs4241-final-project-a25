import { Router } from 'express';
import User from '../models/User.js';

const r = Router();
// auth req
r.use((req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'auth required' });
  next();
});
// get users fav stops
r.get('/', async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ favorites: user.favorites || [] });
});
// add fav stop
r.post('/', async (req, res) => {
  const { stopId, stopName, route } = req.body || {};
  if (!stopId) return res.status(400).json({ error: 'stopId required' });
  const user = await User.findById(req.user.id);
  user.favorites = user.favorites || [];
  if (!user.favorites.find(f => f.stopId === stopId)) {
    user.favorites.push({ stopId, stopName, route });
  }
  await user.save();
  res.json({ ok: true, favorites: user.favorites });
});
// remove fav stop
r.delete('/:stopId', async (req, res) => {
  const user = await User.findById(req.user.id);
  user.favorites = (user.favorites || []).filter(f => f.stopId !== req.params.stopId);
  await user.save();
  res.json({ ok: true, favorites: user.favorites });
});

export default r;
