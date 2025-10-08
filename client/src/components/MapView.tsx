import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { connectWS } from '../lib/ws';
import type { Vehicle } from '../types';

const icon = L.divIcon({
  className: 'vehicle',
  html: `<div style="width:10px;height:10px;border-radius:50%;background:#111;opacity:.9"></div>`,
  iconSize: [10,10]
});
// map view component allows live vehicle tracking
export default function MapView() {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map('map', { zoomControl: true, attributionControl: true })
      .setView([42.3601, -71.0589], 12); 

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    mapRef.current = map;

    const ws = connectWS((vehicles: Vehicle[]) => {
      setCount(vehicles.length);

      vehicles.forEach(v => {
        const key = v.id;
        const m = markersRef.current[key];
        if (!m) {
          markersRef.current[key] = L.marker([v.lat, v.lon], { icon }).addTo(map);
        } else {
          m.setLatLng([v.lat, v.lon]);
        }
      });

      // marker clean up for vehicles that are not active
      const activeIds = new Set(vehicles.map(v=>v.id));
      Object.entries(markersRef.current).forEach(([id, marker]) => {
        if (!activeIds.has(id)) {
          marker.remove();
          delete markersRef.current[id];
        }
      });
    });

    return () => { ws.close(); map.remove(); };
  }, []);
  // map container showing vehicle count
  return (
    <section className="rounded-2xl overflow-hidden border">
      <div className="flex items-center justify-between px-4 py-2 text-sm bg-white">
        <div className="font-medium">Live Trains</div>
        <div className="text-neutral-500">{count} vehicles</div>
      </div>
      <div id="map" role="application" aria-label="MBTA live map" className="h-[540px] w-full"></div>
    </section>
  );
}
