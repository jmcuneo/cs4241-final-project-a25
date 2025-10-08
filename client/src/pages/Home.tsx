import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import AlertTicker from '../components/AlertTicker';
import { API } from '../lib/api';
import MapView from '../components/MapView';
// Home page with map and alerts
export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  useEffect(()=>{ (async()=>{
    const me = await API.me(); setUser(me.user);
    const a = await API.alerts(); setAlerts(a.data || []);
  })(); }, []);
  return (
    <div>
      <Navbar user={user}/>
      <AlertTicker items={alerts}/>
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <MapView/>
        <section className="grid md:grid-cols-2 gap-6">
          <article className="rounded-2xl shadow p-6 bg-white">
            <h2 className="text-lg font-semibold mb-2">What is this?</h2>
            <p className="text-sm">
              Live MBTA subway tracker. Watch trains move, check alerts, and save your stops!
            </p>
          </article>
          <article className="rounded-2xl shadow p-6 bg-white">
            <h2 className="text-lg font-semibold mb-2">Privacy Policy </h2>
            <p className="text-sm">
              We store only your GitHub ID, name, avatar, and favorited stops, nothing else.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
