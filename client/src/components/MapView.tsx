import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { decode } from "@googlemaps/polyline-codec";
import { API } from '../lib/api';
import { connectWS } from '../lib/ws';
import type { Vehicle } from '../types';

const getLineColor = (route: string): string => {
  const colors: Record<string, string> = {
    'Red': '#DA291C',
    'Blue': '#003DA5',
    'Orange': '#ED8B00',
    'Green': '#00843D',
    'Green-B': '#00843D',
    'Green-C': '#00843D',
    'Green-D': '#00843D',
    'Green-E': '#00843D',
    'default': '#111'
  };

  for (const [line, color] of Object.entries(colors)) {
    if (route.toLowerCase().includes(line.toLowerCase())) {
      return color;
    }
  }
  return colors.default;
}
const generateIcon = (route: string): L.DivIcon => {
  const color = getLineColor(route);
  return L.divIcon({
    className: 'vehicle',
    html: `<div style="width:10px;height:10px;border-radius:50%;background:${color};opacity:.9;border:1px solid black;"></div>`,
    iconSize: [10,10]
  })
}
const mapRouteShapes = async (map: L.Map) => {
  const routes = [
    'Red', 
    'Blue', 
    'Orange', 
    'Green-B', 
    'Green-C', 
    'Green-D',
    'Green-E',
  ];

  for (const route of routes) {
    try {
      const data = await API.shapes(route);
      if (data && data.length > 0) {
        data.forEach((shape: any) => {
         if (shape.attributes && shape.attributes.polyline) {
          const coordinates = decode(shape.attributes.polyline);
          L.polyline(coordinates, {
              color: getLineColor(route),
              weight: 4,
              opacity: 0.7,
              lineJoin: 'round'
            }).addTo(map);
          }
        })
      }
    }
    catch (error) {
      console.error('Unable to fetch shapes for route.');
    }
  }
}

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
    mapRouteShapes(map);
    mapRef.current = map;

    const ws = connectWS((vehicles: Vehicle[]) => {
      setCount(vehicles.length);

      vehicles.forEach(v => {
        console.log('Processing vehicle:', v.id, v.lat, v.lon);
        const key = v.id;
        const m = markersRef.current[key];
        const vehicleIcon = generateIcon(v.route || 'default');
        if (!m) {
          console.log('Creating new marker for:', v.id);
          markersRef.current[key] = L.marker([v.lat, v.lon], { icon: vehicleIcon }).addTo(map);
        } else {
          console.log('Updating marker for:', v.id);
          m.setLatLng([v.lat, v.lon]);
          m.setIcon(vehicleIcon);
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
      <div className="flex items-center justify-between px-4 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white">
        <div className="font-medium">Live Trains</div>
        <div className="text-neutral-500">{count} vehicles</div>
      </div>
      <div id="map" role="application" aria-label="MBTA live map" className="h-[540px] w-full"></div>
    </section>
  );
}
