import React from 'react';
// login gate comp
export default function LoginGate({ user, children }:{ user:any; children:any }) {
  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="mb-4">Please log in with GitHub to save favorites.</p>
        <a className="px-4 py-2 rounded-xl bg-neutral-900 text-white inline-block" href="/auth/github">Login with GitHub</a>
      </div>
    );
  }
  return children;
}
