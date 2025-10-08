import { Router } from 'express';
const r = Router();

r.get('/', (req, res) => {
  if (!req.user) return res.status(401).json({ user: null });
  res.json({ user: { id: req.user.id, name: req.user.name, avatar: req.user.avatar } });
});

export default r;
