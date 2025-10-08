import React, { useEffect, useState } from 'react';
import MiniCard from './MiniCard';
import { API } from '../lib/api';

export default function FavoritesPanel() {
  const [favs, setFavs] = useState<any[]>([]);
  const [preds, setPreds] = useState<Record<string, any>>({});

  async function load() {
    const { favorites } = await API.favorites();
    setFavs(favorites || []);
    favorites?.forEach(async (f:any) => {
      const p = await API.predictions(f.stopId);
      setPreds(s => ({ ...s, [f.stopId]: p }));
    });
  }
  useEffect(()=>{ load(); }, []);
  //return list of favs with next arrivals
  return (
    <MiniCard title="My Stops">
      {!favs.length && <p className="text-sm text-neutral-500">No favorites yet.</p>}
      <ul className="space-y-3">
        {favs.map(f => (
          <li key={f.stopId} className="border rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{f.stopName || f.stopId}</div>
                <div className="text-xs text-neutral-500">{f.route || ''}</div>
              </div>
              <button
                className="text-red-600 text-sm"
                onClick={async ()=>{
                  await API.delFavorite(f.stopId);
                  setFavs(prev => prev.filter(x=>x.stopId!==f.stopId));
                }}
                aria-label={`Remove ${f.stopName || f.stopId} from favorites`}>
                Remove
              </button>
            </div>
            <div className="mt-2 text-sm">
              {(preds[f.stopId]?.data || []).slice(0,3).map((p:any)=>(
                <div key={p.id}>
                  {p.attributes?.arrival_time ? new Date(p.attributes.arrival_time).toLocaleTimeString() : '—'} — {p.relationships?.route?.data?.id}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </MiniCard>
  );
}
