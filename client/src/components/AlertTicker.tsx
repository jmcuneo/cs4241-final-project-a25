import React, { useMemo, useState } from 'react';

function tx(x: any) {
  if (!x) return '';
  if (typeof x === 'string') return x;
  return x?.translation?.[0]?.text || '';
}

function timeAgo(iso?: string) {
  if (!iso) return '';
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.max(0, Math.round(d / 60000));
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  return `${h}h ago`;
}

function normalize(a: any) {
  const at = a?.attributes || {};
  const title =
    tx(at.short_header_text) ||
    tx(at.header_text) ||
    tx(at.short_header) ||
    tx(at.header) ||
    tx(at.service_effect) ||
    'Service alert';

  const meta = [at.effect, at.cause, at.timeframe, at.severity].filter(Boolean).join(' · ');
  const details =
    tx(at.short_description) ||
    tx(at.description_text) ||
    tx(at.description) ||
    '';

  return {
    id: a.id,
    title,
    meta,
    details,
    when: timeAgo(at.updated_at),
    url: at.url
  };
}

export default function AlertTicker({ items }:{ items:any[] }) {
  const [open, setOpen] = useState(false);
  const rows = useMemo(() => (items || []).slice(0, 12).map(normalize), [items]);
  const count = rows.length;

  if (!count) return null;

  // simple alert ticker with show/hide feature
  return (
    <section className="border-y bg-amber-50 dark:bg-amber-800 dark:text-white" role="alert" aria-live="polite">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="text-sm">
          <span className="font-medium">Service Alerts</span>
          <span className="ml-2 text-neutral-600 dark:text-gray-400">({count})</span>
        </div>
        <button
          className="text-sm px-3 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 dark:bg-amber-900"
          onClick={()=>setOpen(v=>!v)}
          aria-expanded={open}
          aria-controls="alerts-panel"
        >
          {open ? 'Hide' : 'Show'} alerts
        </button>
      </div>
      
      {open && (
        <div id="alerts-panel" className="max-w-6xl mx-auto px-4 pb-3">
          <div className="rounded-xl border bg-white p-2 max-h-72 overflow-auto dark:bg-gray-800">
            <ul className="space-y-2">
              {rows.map(r => (
                <li key={r.id} className="border rounded-lg dark:bg-gray-600">
                  <details>
                    <summary className="list-none cursor-pointer px-3 py-2 flex items-center gap-2">
                      <span className="text-sm font-medium">Alert:</span>
                      <span className="text-sm">{r.title}</span>
                      {r.meta && <span className="text-xs text-neutral-400">— {r.meta}</span>}
                      {r.when && <span className="ml-auto text-xs text-neutral-300">{r.when}</span>}
                    </summary>
                    {(r.details || r.url) && (
                      <div className="px-3 pb-3 text-sm text-neutral-800 dark:bg-gray-700 dark:text-white">
                        {r.details && <p className="whitespace-pre-wrap">{r.details}</p>}
                        {r.url && (
                          <p className="mt-2">
                            <a className="underline" href={r.url} target="_blank" rel="noreferrer">details</a>
                          </p>
                        )}
                      </div>
                    )}
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}