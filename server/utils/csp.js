// tiny CSP helper, allows Leaflet tiles + vite dev in local
export const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'"],
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'", "data:", "https:", "http:"],
  connectSrc: ["'self'", "https://api-v3.mbta.com", "ws:", "wss:"],
  fontSrc: ["'self'", "data:"]
};
