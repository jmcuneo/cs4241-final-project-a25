"use client"
import {useState, useEffect} from "react";

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
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", padding: "20px"}}>

            {/* Opponent info at the top */}
            <div style={{
                textAlign: "center",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                minWidth: "200px"
            }}>
                <h3>Opponent</h3>
                <p>Cards Remaining: {props.opponentDeckCount ?? "?"}</p>
                <p>Last Played: {props.lastOpponentCard ?? "None"}</p>
            </div>

            {/* Play button in the middle */}
            <div>
                <button
                    onClick={playTopCard}
                    // disabled={pDeck.length === 0 || !isConnected || !roomId}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        // cursor: pDeck.length === 0 || !isConnected || !roomId ? "not-allowed" : "pointer"
                    }}
                >
                    Play Card
                </button>
            </div>

            {/* Player info at the bottom */}
            <div style={{
                textAlign: "center",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                minWidth: "200px"
            }}>
                {/*<h3>You {playerNumber ? `(Player ${playerNumber})` : ""}</h3>*/}
                <p>Cards Remaining: {pDeck.length}</p>
                <p>Last Played: {lastPlayerCard ?? "None"}</p>
            </div>
        </div>
    );
}
