import { Router } from 'express';
import { fetchAlerts } from '../mbta.js';

const r = Router();
// GET alerts from mbta
r.get('/', async (req, res) => {
  try {
    const data = await fetchAlerts();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default r;
