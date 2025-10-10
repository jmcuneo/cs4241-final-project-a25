import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/globals.css';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

const App = (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/settings" element={<Settings/>}/>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  </BrowserRouter>
);

const root = createRoot(document.getElementById('root')!);
// strict mode messes with useEffect timing, so only enable in prod
if (import.meta.env.PROD) {
  root.render(<React.StrictMode>{App}</React.StrictMode>);
} else {
  root.render(App);
}
