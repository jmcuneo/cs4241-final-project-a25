"use client"
import { useState, useEffect } from "react";

interface GameClientProps {
    deck: string[];
    onPlay: (card: string) => void;
    onPlayEnd: () => void;
    opponentDeckCount?: number; // optional: from server
    lastOpponentCard?: string;  // optional: from server
}

export default function GameClient(props: GameClientProps) {
    const [pDeck, setpDeck] = useState<string[]>(props.deck);
    const [lastPlayerCard, setLastPlayerCard] = useState<string | null>(null);

    const playTopCard = () => {
        if (pDeck.length === 0) return; // nothing to play
        const topCard = pDeck[0]; // take the top card
        setpDeck(pDeck.slice(1));  // remove the top card
        props.onPlay(topCard);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>

            {/* Opponent info at the top */}
            <div style={{ textAlign: "center" }}>
                <p>Opponent Cards: {props.opponentDeckCount ?? "?"}</p>
                <p>Opponent Last Played: {props.lastOpponentCard ?? "None"}</p>
            </div>

            {/* Play button in the middle */}
            <div>
                <button onClick={playTopCard} disabled={pDeck.length === 0}>
                    Play Card
                </button>
                {/*<button onClick={props.onPlayEnd} style={{ marginLeft: "10px" }}>*/}
                {/*    Forfeit*/}
                {/*</button>*/}
            </div>

            {/* Player info at the bottom */}
            <div style={{ textAlign: "center" }}>
                <p>Your Cards: {pDeck.length}</p>
                <p>Your Last Played: {lastPlayerCard ?? "None"}</p>
            </div>
        </div>
    );
}
