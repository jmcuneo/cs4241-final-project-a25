import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import LoginGate from '../components/LoginGate';
import FavoritesPanel from '../components/FavoritesPanel';
import StopSearch from '../components/StopSearch';
import { API } from '../lib/api';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  useEffect(()=>{ (async()=>{ const me = await API.me(); setUser(me.user); })(); }, []);
  return (
    <div>
      <Navbar user={user}/>
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <LoginGate user={user}>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <FavoritesPanel/>
            </div>
            <div className="md:col-span-1">
              <StopSearch/>
            </div>
          </div>
        </LoginGate>
      </main>
    </div>
  );
}
