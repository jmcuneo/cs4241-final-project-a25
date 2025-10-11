import React from 'react';
// card view
export default function MiniCard(props: React.PropsWithChildren<{title: string; className?: string}>) {
  return (
    <section className={`rounded-2xl shadow p-4 bg-white dark:bg-gray-800 dark:text-white ${props.className||''}`}>
      <h2 className="font-semibold mb-2">{props.title}</h2>
      {props.children}
    </section>
  );
}
