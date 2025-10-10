import React, { useState } from 'react';
import MiniCard from './MiniCard';
import { API } from '../lib/api';
import { SelectStop } from './SelectStop';

//user pastes stop id + name they know
export default function StopSearch() {
  const [stopId, setStopId] = useState('');
  const [stopName, setStopName] = useState('');
  const [route, setRoute] = useState('');

  return (
    <MiniCard title="Add Favorite Stop">
      <form className="flex flex-col gap-2" onSubmit={async (e)=>{
        e.preventDefault();
        if (!stopId) return;
        await API.addFavorite({ stopId, stopName, route });
        setStopId(''); setStopName(''); setRoute('');
        location.reload();
      }}>
        <label className="text-sm">
          <span className="block mb-1">Stop ID</span>
          <SelectStop value={stopId} onChange={e=>setStopId(e)} required />
        </label>
        <label className="text-sm">
          <span className="block mb-1">Stop Name (optional)</span>
          <input value={stopName} onChange={e=>setStopName(e.target.value)} className="w-full border rounded-lg px-3 py-2"/>
        </label>
        <label className="text-sm">
          <span className="block mb-1">Route (optional)</span>
          <input value={route} onChange={e=>setRoute(e.target.value)} className="w-full border rounded-lg px-3 py-2"/>
        </label>
        <button className="self-start px-4 py-2 rounded-xl bg-neutral-900 text-white">Save</button>
      </form>
      <p className="mt-2 text-xs text-neutral-500">
        Tip: you can find stop IDs on the MBTA site or dev docs.
      </p>
    </MiniCard>
  );
}