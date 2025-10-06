"use client"
import { useState, useEffect, useRef } from "react";

interface GameClientProps {
    deck: string[];
    onPlay: (card: string) => void;
    onPlayEnd: () => void;
}

export default function GameConnection(props: GameClientProps) {
    const [pDeck, setpDeck] = useState<string[]>(props.deck);
    const [lastPlayerCard, setLastPlayerCard] = useState<string | null>(null);
    const [opponentDeckCount, setOpponentDeckCount] = useState<number | null>(null);
    const [lastOpponentCard, setLastOpponentCard] = useState<string | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [playerNumber, setPlayerNumber] = useState<number | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [gameStatus, setGameStatus] = useState<string>("Connecting...");

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const connectWebSocket = () => {
            if (typeof window === "undefined") return;

            // Connect directly to port 3001 where WebSocket server is running
            const ws = new WebSocket('ws://localhost:3001');

            ws.onopen = () => {
                console.log('WebSocket connected to port 3001');
                setIsConnected(true);
                setGameStatus("Waiting for opponent...");
            };

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log('Received:', message);

                switch (message.event) {
                    case "joined":
                        setRoomId(message.data.roomId);
                        setPlayerNumber(message.data.player);
                        setGameStatus(`Game started! You are Player ${message.data.player}`);
                        break;

                    case "cardPlayed":
                        setLastOpponentCard(message.data.card);
                        setOpponentDeckCount(message.data.deckCount);
                        break;

                    case "opponentDisconnected":
                        setGameStatus("Opponent disconnected. You win!");
                        break;
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            ws.onclose = (event) => {
                console.log('WebSocket closed:', event.code, event.reason);
                setIsConnected(false);
                setGameStatus("Disconnected");

                // Attempt to reconnect after 3 seconds
                reconnectTimeoutRef.current = setTimeout(() => {
                    console.log('Attempting to reconnect...');
                    connectWebSocket();
                }, 3000);
            };

            wsRef.current = ws;
        };

        connectWebSocket();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const playTopCard = () => {
        if (pDeck.length === 0) return;
        const topCard = pDeck[0];
        const newDeck = pDeck.slice(1);

        setpDeck(newDeck);
        setLastPlayerCard(topCard);

        // Send card played to opponent
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                event: "cardPlayed",
                data: {
                    card: topCard,
                    deckCount: newDeck.length
                }
            }));
        }

        props.onPlay(topCard);

        if (newDeck.length === 0) {
            setGameStatus("You won!");
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", padding: "20px" }}>

            {/* Connection status */}
            <div style={{ textAlign: "center" }}>
                <p style={{ fontWeight: "bold" }}>
                    Status: {isConnected ? '🟢' : '🔴'} {gameStatus}
                </p>
                {roomId && <p>Room: {roomId}</p>}
            </div>

            {/* Opponent info at the top */}
            <div style={{ textAlign: "center", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", minWidth: "200px" }}>
                <h3>Opponent</h3>
                <p>Cards Remaining: {opponentDeckCount ?? "?"}</p>
                <p>Last Played: {lastOpponentCard ?? "None"}</p>
            </div>

            {/* Play button in the middle */}
            <div>
                <button
                    onClick={playTopCard}
                    disabled={pDeck.length === 0 || !isConnected || !roomId}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        cursor: pDeck.length === 0 || !isConnected || !roomId ? "not-allowed" : "pointer"
                    }}
                >
                    Play Card
                </button>
            </div>

            {/* Player info at the bottom */}
            <div style={{ textAlign: "center", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", minWidth: "200px" }}>
                <h3>You {playerNumber ? `(Player ${playerNumber})` : ""}</h3>
                <p>Cards Remaining: {pDeck.length}</p>
                <p>Last Played: {lastPlayerCard ?? "None"}</p>
            </div>
        </div>
    );
}