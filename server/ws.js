import { WebSocketServer } from 'ws';
import { fetchVehicles } from './mbta.js';

export function initWS(httpServer) {
  // bind to the HTTP server and handle only /ws
  const wss = new WebSocketServer({
    server: httpServer,
    path: '/ws',
    perMessageDeflate: false
  });

  console.log('[WS] ready on /ws');

  // simple keep-alive
  const interval = setInterval(() => {
    wss.clients.forEach(ws => {
      if (ws.readyState === 1) {
        try { ws.ping(); } catch {}
      }
    });
  }, 15000);

  wss.on('close', () => clearInterval(interval));

  // cache last payload 
  let lastPayload = { type: 'vehicles', ts: Date.now(), data: [] };

  wss.on('connection', (ws, req) => {
    console.log('[WS] client connected from', req.socket.remoteAddress);
    try { ws.send(JSON.stringify({ type: 'hello', ts: Date.now() })); } catch {}
    try { ws.send(JSON.stringify(lastPayload)); } catch {}
  });

  // polling loop and broadcast
  async function loop() {
    try {
      const raw = await fetchVehicles({ 'page[limit]': '200' });
      const vehicles = (raw.data || [])
        .map(v => ({
          id: v.id,
          label: v.attributes?.label,
          bearing: v.attributes?.bearing,
          speed: v.attributes?.speed,
          lat: v.attributes?.latitude,
          lon: v.attributes?.longitude,
          current_status: v.attributes?.current_status,
          route: v.relationships?.route?.data?.id
        }))
        .filter(v => v.lat && v.lon);

      lastPayload = { type: 'vehicles', ts: Date.now(), data: vehicles };
      const msg = JSON.stringify(lastPayload);
      wss.clients.forEach(c => {
        if (c.readyState === 1) {
          try { c.send(msg); } catch {}
        }
      });
    } catch (e) {
      // ignore, try again
    } finally {
      setTimeout(loop, 5000);
    }
  }
  loop();

  return wss;
}
