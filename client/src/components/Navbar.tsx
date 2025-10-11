import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API } from '../lib/api';

// Determine API base URL
const BASE =
  (import.meta as any).env?.VITE_API_BASE ||
  (location.origin.includes('localhost:5173') ? 'http://localhost:8080' : location.origin);


// Navbar comp with user authentication handled

export default function Navbar({ user }:{ user:any }) {
  const nav = useNavigate();
  return (
    <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b dark:bg-gray-800/80 dark:text-white">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-bold">MBTA Live</Link>
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="hover:underline focus-visible:ring-offset-2">Dashboard</Link>
          <Link to="/settings" className="hover:underline focus-visible:ring-offset-2">Settings</Link>
          {user ? (
            <button
              className="px-3 py-1 rounded-xl bg-neutral-900 text-white dark:bg-gray-700 focus-visible:ring-offset-2"
              onClick={async ()=>{ await API.logout(); nav('/'); }}>
              Logout
            </button>
          ) : (
            <a className="px-3 py-1 rounded-xl bg-neutral-900 text-white dark:bg-gray-700 focus-visible:ring-offset-2" href={`${BASE}/auth/github`}>
              Login
            </a>
          )}
          {user && <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />}
        </div>
      </div>
    </nav>
  );
}
