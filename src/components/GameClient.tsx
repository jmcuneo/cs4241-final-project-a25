"use client";
import React, {useEffect, useState} from "react";
import PlayerArea from "@/components/PlayerArea";
import {Card} from "@/app/types";

type DeckTheme = "nordic" | "egyptian"; // Since GameClient now passes the themes to PlayerArea

type GameClientProps = {
    deck: string[];
    onPlay: () => void;
    onPlayEnd: () => void;
    playerName: string;
    opponentName: string;
    gameStatus?: string;
    opponentDeckCount?: number;
    lastOpponentCard?: string;
    lastPlayerCard?: string;
    playerWins?: number;
    opponentWins?: number;
    canPlay?: boolean;
};

function convertToCard(code?: string): Card {
    if (!code || code.length < 2) return {suit: "", rank: ""};
    const suit = code.slice(-1);
    const rank = code.slice(0, -1);
    return {suit, rank};
}

export default function GameClient({
                                       deck,
                                       onPlay,
                                       onPlayEnd,
                                       playerName,
                                       opponentName,
                                       gameStatus,
                                       opponentDeckCount,
                                       lastOpponentCard,
                                       lastPlayerCard,
                                       playerWins = 0,
                                       opponentWins = 0,
                                       canPlay = true,
                                   }: GameClientProps) {
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const [deckTheme, setDeckTheme] = useState<DeckTheme>("nordic"); 
    useEffect(() => {
    // read what Start page saved
    const saved = (typeof window !== "undefined" && localStorage.getItem("deckTheme")) as DeckTheme | null;
    if (saved === "egyptian" || saved === "nordic") setDeckTheme(saved);
    }, []);

    if (playerName === opponentName) opponentName = "Opponent";

    // Show temporary status message
    useEffect(() => {
        if (gameStatus) {
            setStatusMessage(gameStatus);
            const timer = setTimeout(() => setStatusMessage(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [gameStatus]);

    const playTopCard = () => {
        if (!canPlay || deck.length === 0) return;
        onPlay();
    };

    return (
        <div
            className="relative flex flex-col items-center gap-10 justify-center min-h-screen bg-gradient-to-b from-green-800 to-emerald-900 text-white font-semibold overflow-hidden">

            {/* Opponent row */}
            <div className="flex w-full justify-center items-center gap-2 p-2 flex-col">
                <p className="text-center text-sm mt-1">{opponentName} ({opponentDeckCount})</p>
                <PlayerArea
                    isPlayer={false}
                    deck={opponentDeckCount ?? 26}
                    playedCards={[convertToCard(lastOpponentCard)]}
                    winCount={opponentWins}
                    backTheme={deckTheme}
                />
            </div>

            {/* Game status overlay */}
            {statusMessage && (
                <div
                    className="absolute top-1/2 transform -translate-y-1/2 bg-black/70 text-white text-2xl font-bold py-2 px-6 rounded-xl shadow-lg animate-fadeInOut z-20">
                    {statusMessage}
                </div>
            )}

            {/* Player row */}
            <div className="flex w-full justify-center items-center gap-2 p-2 flex-col">
                <PlayerArea
                    isPlayer={true}
                    deck={deck.length}
                    playedCards={[convertToCard(lastPlayerCard)]}
                    winCount={playerWins}
                    onPlayCard={playTopCard}
                    backTheme={deckTheme}
                />
                <p className="text-center text-sm mt-1">{playerName} ({opponentDeckCount})</p>
            </div>

            <style jsx global>{`
                @keyframes fadeInOut {
                    0% {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    10% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    90% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                }

                .animate-fadeInOut {
                    animation: fadeInOut 2s ease-in-out forwards;
                }
            `}</style>
        </div>
    );
}
