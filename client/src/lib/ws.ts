// client/src/lib/ws.ts
import type { Vehicle } from '../types';

type VehiclesMsg = { type: 'vehicles'; ts: number; data: Vehicle[] };

function wsUrl() {
  // explicit env wins (use this)
  const envUrl = (import.meta as any).env?.VITE_WS_URL as string | undefined;
  if (envUrl) return envUrl;

  // fallback: same-origin (dev proxy)
  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${proto}//${location.host}/ws`;
}

export function connectWS(onVehicles: (v: Vehicle[]) => void) {
  const url = wsUrl();

  let ws: WebSocket | null = null;
  let stopped = false;
  let retry = 0;

  const open = () => {
    if (stopped) return;
    ws = new WebSocket(url);

    ws.onopen = () => { retry = 0; };

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data) as VehiclesMsg;
        if (msg?.type === 'vehicles' && Array.isArray(msg.data)) onVehicles(msg.data);
      } catch {}
    };

    ws.onerror = () => { /* let close handler retry */ };

    ws.onclose = () => {
      if (stopped) return;
      const wait = Math.min(8000, 500 + retry * 1000);
      retry++;
      setTimeout(open, wait);
    };
  };

  open();

  return {
    close() { stopped = true; try { ws?.close(); } catch {} }
  };
}
