"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function QueuePage() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(10); // fake queue timer

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      router.push("/game");
    }
  }, [seconds, router]);

  return (
    <main className="min-h-dvh grid place-items-center bg-gradient-to-b from-zinc-900 to-zinc-800 text-zinc-100">
      <div className="rounded-2xl p-8 shadow-xl bg-zinc-900/60 backdrop-blur w-[min(90vw,480px)] text-center">
        <h1 className="text-2xl font-bold">Waiting for another player…</h1>
        <p className="mt-2 text-zinc-400">We&apos;ll start as soon as someone joins.</p>

        <div className="mt-6 text-6xl font-extrabold tabular-nums">{seconds}</div>
        <p className="text-sm text-zinc-400 mt-1">auto-start</p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => router.push("/game")}
            className="rounded-lg bg-sky-500 px-4 py-2 font-semibold hover:bg-sky-600"
          >
            Start match now
          </button>
          <button
            onClick={() => router.push("/")}
            className="rounded-lg border border-zinc-600 px-4 py-2 hover:bg-zinc-800"
          >
            Back
          </button>
        </div>
      </div>
    </main>
  );
}