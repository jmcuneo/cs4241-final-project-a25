import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { API } from '../lib/api';
import { Link } from 'react-router-dom';

export default function Settings() {
  const [user, setUser] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(()=>{ (async()=>{ const me = await API.me(); setUser(me.user); })(); }, []);
  useEffect(()=>{
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const canManage = useMemo(()=>Boolean(user), [user]);
  // export user data as json file
  async function exportData() {
    setBusy(true);
    try {
      const [stops, routes] = await Promise.all([
        canManage ? API.favorites() : Promise.resolve({ favorites: [] }),
        canManage ? API.favoriteRoutes() : Promise.resolve({ favoriteRoutes: [] })
      ]);
      const payload = {
        user: user ? { id: user.id, name: user.name } : null,
        favorites: stops.favorites || [],
        favoriteRoutes: routes.favoriteRoutes || [],
        exportedAt: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'mbta-live-export.json'; a.click();
      URL.revokeObjectURL(url);
    } finally { setBusy(false); }
  }
  // clear all favorites
  async function clearAllFavorites() {
    if (!canManage) return;
    setBusy(true);
    try {
      const [stops, routes] = await Promise.all([API.favorites(), API.favoriteRoutes()]);
      for (const f of (stops.favorites || [])) { await API.delFavorite(f.stopId); }
      for (const r of (routes.favoriteRoutes || [])) { await API.delFavoriteRoute(r.routeId); }
      alert('Cleared favorites.');
    } finally { setBusy(false); }
  }
  // settings page with user info, theme toggle, export data, and clear favorites
  return (
    <div>
      <Navbar user={user}/>
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <section className="rounded-2xl shadow p-6 bg-white">
          <h2 className="text-lg font-semibold mb-2">Settings</h2>
          {!user && <p className="text-sm">Login to manage settings.</p>}
          {user && (
            <div className="text-sm space-y-4">
              <div className="flex items-center gap-3">
                <img src={user.avatar} className="w-10 h-10 rounded-full" alt=""/>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-neutral-500 text-xs">User ID: {user.id}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm">Theme</span>
                <button
                  className="px-3 py-1 rounded-lg border"
                  onClick={()=>setTheme(t=> t === 'dark' ? 'light' : 'dark')}
                  disabled={busy}
                >
                  {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to="/dashboard" className="px-3 py-1 rounded-lg bg-neutral-900 text-white">Open Dashboard</Link>
                <button className="px-3 py-1 rounded-lg border" onClick={exportData} disabled={busy}>Export My Data</button>
                <button className="px-3 py-1 rounded-lg border text-red-600" onClick={clearAllFavorites} disabled={busy}>Clear All Favorites</button>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-2xl shadow p-6 bg-white">
          <h3 className="font-semibold mb-2">Accessibility</h3>
          <ul className="list-disc ml-5 text-sm space-y-1">
            <li>Keyboard focus styles (focus-visible).</li>
            <li>Color contrast on primary actions.</li>
            <li>ARIA live region for alerts.</li>
            <li>Map labeled as application with descriptive label.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}