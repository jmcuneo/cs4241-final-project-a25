"use client"
import {useState, useEffect, useRef} from "react";
import GameClient from "@/components/GameClient";

interface Game {
    deck: string[];
    onPlay: (card: string) => void;
    onPlayEnd: () => void;
}

export default function Game(props: Game) {
    const [pDeck, setpDeck] = useState<string[]>(props.deck);
    const [lastPlayerCard, setLastPlayerCard] = useState<string | undefined>(undefined);
    const [opponentDeckCount, setOpponentDeckCount] = useState<number | undefined>(undefined);
    const [lastOpponentCard, setLastOpponentCard] = useState<string | undefined>(undefined);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [playerNumber, setPlayerNumber] = useState<number | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [gameStatus, setGameStatus] = useState<string>("Connecting...");

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const connectWebSocket = () => {
            if (typeof window === "undefined") return;

            const ws = new WebSocket('ws://localhost:3001');

            // ws.binaryType = "arraybuffer";

            ws.onopen = () => {
                console.log('WebSocket connected to port 3001');
                setIsConnected(true);
                setGameStatus("Waiting for opponent...");
            };

            ws.onmessage = (event) => {
                // console.log(event)
                // console.log(event.data.text())
                const message = JSON.parse(event.data);
                // const message = await event.data.text()
                console.log('Received:', message);
                console.log('Received:', event.data);
                const eventString: string = message.event;
                console.log("Event: ", eventString);
                switch (eventString) {
                    case "joined":
                        setRoomId(message.data.roomId);
                        setPlayerNumber(message.data.player);
                        setGameStatus(`Game started! You are Player ${message.data.player}`);
                        break;

                    case "play":
                        console.log("Opponent played: ", message.data)
                        setLastOpponentCard(message.data.card);
                        setOpponentDeckCount(message.data.deckCount);
                        break;

                    case "opponentDisconnected":
                        setGameStatus("Opponent disconnected. You win!");
                        break;

                    default:
                        console.log("defaulting")
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
                event: "play",
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
        <div>
            {/* Connection status */}
            {!isConnected || gameStatus === "Waiting for opponent..." ?
                <div style={{textAlign: "center"}}>
                    <p style={{fontWeight: "bold"}}>
                        Status: {isConnected ? '🟢' : '🔴'} {gameStatus}
                    </p>
                    {roomId && <p>Room: {roomId}</p>}
                </div>
                :
                <GameClient deck={pDeck} onPlay={playTopCard} onPlayEnd={playTopCard}
                            opponentDeckCount={opponentDeckCount} lastOpponentCard={lastOpponentCard}/>
            }
        </div>
    );
}