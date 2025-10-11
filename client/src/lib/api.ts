const BASE =
  (import.meta as any).env?.VITE_API_BASE ||
  (location.origin.includes('localhost:5173') ? 'http://localhost:8080' : location.origin);

export const API = {
  async me() {
    const r = await fetch(`${BASE}/api/me`, { credentials: 'include', mode: 'cors' });
    return r.json();
  },
  async logout() {
    const r = await fetch(`${BASE}/auth/logout`, { method: 'POST', credentials: 'include', mode: 'cors' });
    return r.json();
  },
  async alerts() {
    const r = await fetch(`${BASE}/api/alerts`, { credentials: 'include', mode: 'cors' });
    return r.json();
  },
  async favorites() {
    const r = await fetch(`${BASE}/api/favorites`, { credentials: 'include', mode: 'cors' });
    return r.json();
  },
  async addFavorite(payload: { stopId: string; stopName?: string; route?: string }) {
    const r = await fetch(`${BASE}/api/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify(payload)
    });
    return r.json();
  },
  async delFavorite(stopId: string) {
    const r = await fetch(`${BASE}/api/favorites/${stopId}`, {
      method: 'DELETE',
      credentials: 'include',
      mode: 'cors'
    });
    return r.json();
  },
  async predictions(stopId: string) {
    const r = await fetch(`${BASE}/api/predictions/${stopId}`, { credentials: 'include', mode: 'cors' });
    return r.json();
  },
  async shapes(route: string) {
    const r = await fetch(`${BASE}/api/shapes/${route}`, { credentials: 'include', mode: 'cors' });
    return r.json();
  },
  async getStops() {
    const r = await fetch(`${BASE}/api/listStops`, { credentials: 'include', mode: 'cors' });
    return r.json();
  }
};

