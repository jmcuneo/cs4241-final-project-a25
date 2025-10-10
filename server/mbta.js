import fetch from 'node-fetch';

// Base MBTA API URL
const BASE = 'https://api-v3.mbta.com';

// Adds API key header if provided
const headers = (key) => key ? { 'x-api-key': key } : {};

// Get live vehicle data (bus, train, whatever...)
export async function fetchVehicles(params = {}) {
  const query = new URLSearchParams({
    'include': 'stop,route',
    'filter[route_type]': '0,1', // subway types
    ...params
  });
  const res = await fetch(`${BASE}/vehicles?${query.toString()}`, { headers: headers(process.env.MBTA_API_KEY) });
  if (!res.ok) throw new Error(`vehicles: ${res.status}`);
  return res.json();
}

//Get upcoming departure predictions for a stop
export async function fetchPredictionsByStop(stopId) {
  const query = new URLSearchParams({
    'filter[stop]': stopId,
    'include': 'route,trip,stop',
    'page[limit]': '20',
    'sort': 'departure_time'
  });
  const res = await fetch(`${BASE}/predictions?${query.toString()}`, { headers: headers(process.env.MBTA_API_KEY) });
  if (!res.ok) throw new Error(`predictions: ${res.status}`);
  return res.json();
}

// Get service alerts
export async function fetchAlerts(params = {}) {
  const query = new URLSearchParams({
    'filter[route_type]': '0,1',
    'page[limit]': '10',
    'sort': '-updated_at', // newest first
    ...params
  });
  const res = await fetch(`${BASE}/alerts?${query.toString()}`, { headers: headers(process.env.MBTA_API_KEY) });
  if (!res.ok) throw new Error(`alerts: ${res.status}`);
  return res.json();
}

export async function fetchRouteShapes(route) {
  const res = await fetch(`${BASE}/shapes?filter[route]=${route}`, { headers: headers(process.env.MBTA_API_KEY) });
  if (!res.ok) throw new Error(`shapes: ${res.status}`);
  return res.json();
}

//Get upcoming departure predictions for a stop
export async function fetchStops() {
  // const query = new URLSearchParams({
  //   'filter[stop]': stopId,
  //   'include': 'route,trip,stop',
  //   'page[limit]': '20',
  //   'sort': 'departure_time'
  // });
  const res = await fetch(`${BASE}/stops`, { headers: headers(process.env.MBTA_API_KEY) });
  if (!res.ok) throw new Error(`predictions: ${res.status}`);
  return res.json();
}