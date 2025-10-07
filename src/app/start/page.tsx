"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type DeckTheme = "nordic" | "egyptian";

export default function StartPage() {
    // Pretend user – replace with your real auth state when wired.
    const [user, setUser] = useState<{ name: string; wins: number; losses: number } | null>(null);
    const [deck, setDeck] = useState<DeckTheme>("nordic");
    const [showRules, setShowRules] = useState(false);

    useEffect(() => {
        // If you already have auth, read it here instead.
        // This is just a demo stub you can delete once GitHub auth is wired.
        const demo = { name: "Guest", wins: 3, losses: 1 };
        setUser(demo);
    }, []);

    const handlePlay = () => {
        localStorage.setItem("deckTheme", deck);
        window.location.href = "/play";
    };

    return (
        <main className="min-h-dvh flex items-center justify-center p-6 bg-gradient-to-b from-zinc-900 to-zinc-800 text-zinc-100">
            <div className="w-full max-w-3xl rounded-2xl p-6 shadow-xl bg-zinc-900/60 backdrop-blur">
                <h1 className="text-3xl font-bold tracking-tight">WAR — Card Game</h1>
                <p className="text-sm text-zinc-400 mt-1">Multiplayer demo</p>

                {/* Auth box */}
                <section className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-zinc-700 p-4">
                        <h2 className="font-semibold mb-2">Sign in</h2>
                        {user ? (
                            <div className="text-sm">
                                <div className="font-medium">Hello, {user.name}</div>
                                <div className="mt-2 flex gap-4 text-zinc-400">
                                    <span>Wins: {user.wins}</span>
                                    <span>Losses: {user.losses}</span>
                                </div>
                            </div>
                        ) : (
                            <button
                                className="w-full rounded-lg border border-zinc-600 px-3 py-2 text-left hover:bg-zinc-800"
                                // Replace this href with our real auth route
                                onClick={() => alert("TODO: Wire GitHub login — replace this button with GitHub auth component")}
                            >
                                <span className="font-medium">Continue with GitHub</span>
                                <span className="block text-xs text-zinc-400">Placeholder login button</span>
                            </button>
                        )}
                        <p className="mt-2 text-xs text-zinc-500">
                            Already wired elsewhere? Swap this button for your GitHub auth component.
                        </p>
                    </div>

                    {/* Deck selection */}
                    <div className="rounded-xl border border-zinc-700 p-4">
                        <h2 className="font-semibold mb-2">Choose your deck back</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <label className={`cursor-pointer select-none rounded-xl border p-3 ${deck === "nordic" ? "border-sky-400 shadow-[0_0_0_2px] shadow-sky-400/30" : "border-zinc-700 hover:border-zinc-600"}`}>
                                <input
                                    type="radio"
                                    name="deck"
                                    value="nordic"
                                    checked={deck === "nordic"}
                                    onChange={() => setDeck("nordic")}
                                    className="hidden"
                                />
                                <div className="aspect-[15/21] rounded-lg relative overflow-hidden flex items-center justify-center
                                bg-gradient-to-br from-sky-900 to-sky-600">
                                    {/* Nordic rune grid */}
                                    <div className="absolute inset-0 opacity-25 [background:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:16px_16px]" />
                                    <div className="text-3xl">ᚠᚢᚦ</div>
                                    <div className="absolute inset-2 rounded-lg border border-white/30" />
                                </div>
                                <div className="mt-2 text-sm font-medium">Nordic</div>
                            </label>

                            <label className={`cursor-pointer select-none rounded-xl border p-3 ${deck === "egyptian" ? "border-amber-400 shadow-[0_0_0_2px] shadow-amber-400/30" : "border-zinc-700 hover:border-zinc-600"}`}>
                                <input
                                    type="radio"
                                    name="deck"
                                    value="egyptian"
                                    checked={deck === "egyptian"}
                                    onChange={() => setDeck("egyptian")}
                                    className="hidden"
                                />
                                <div className="aspect-[15/21] rounded-lg relative overflow-hidden flex items-center justify-center
                                bg-gradient-to-br from-amber-900 to-yellow-700">
                                    {/* Egyptian motif: faint chevrons + ankh */}
                                    <div className="absolute inset-0 opacity-25 [background:repeating-linear-gradient(135deg,black,black_6px,transparent_6px,transparent_12px)] mix-blend-soft-light" />
                                    <div className="text-3xl">☥</div>
                                    <div className="absolute inset-2 rounded-lg border border-black/30" />
                                </div>
                                <div className="mt-2 text-sm font-medium">Egyptian</div>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-3">
                    <button
                        onClick={handlePlay}
                        className="rounded-lg bg-sky-500 px-4 py-2 font-semibold hover:bg-sky-600 active:translate-y-px"
                    >
                        Play
                    </button>
                    <button
                        onClick={() => setShowRules(true)}
                        className="rounded-lg border border-zinc-600 px-4 py-2 hover:bg-zinc-800"
                    >
                        Rules
                    </button>
                    <Link href="/game" className="ml-auto text-sm text-zinc-400 underline-offset-4 hover:underline">
                        Skip to board (dev)
                    </Link>
                </div>

                {/* Rules "add more if needed" */}
                {showRules && (
                    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
                        <div className="w-full max-w-xl rounded-2xl bg-zinc-900 p-6 shadow-xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">How to Play WAR</h3>
                                <button onClick={() => setShowRules(false)} className="rounded-md px-2 py-1 text-sm hover:bg-zinc-800">✕</button>
                            </div>
                            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-zinc-300">
                                <li>Each player starts with 26 face-down cards from a standard deck.</li>
                                <li>On your turn, flip your top card to the table. Higher rank wins the round (A high).</li>
                                <li>On a tie, it’s “WAR”: both players burn 3 cards face-down, then flip a 4th; winner takes all flipped cards.</li>
                                <li>Winner of the round adds all flipped cards to the bottom of their pile.</li>
                                <li>Game ends when one player collects all 52 cards (or someone runs out of cards).</li>
                            </ol>
                            <div className="mt-6 text-right">
                                <button onClick={() => setShowRules(false)} className="rounded-lg bg-sky-500 px-4 py-2 font-semibold hover:bg-sky-600">
                                    Got it
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}