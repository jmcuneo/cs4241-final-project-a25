"use client";
import {useState, useRef, useEffect} from "react";
import GameClient from "@/components/GameClient";

export default function GameConnection() {
    const [opponentDeckCount, setOpponentDeckCount] = useState<number>(26); // example initial count
    const [lastOpponentCard, setLastOpponentCard] = useState<string | undefined>(undefined);
    const [connected, setConnected] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);
    const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [searching, setSearching] = useState(false);
    const [card, setCard] = useState("1h");

    useEffect(() => {
        return () => {
            // clean up if component unmounts
            if (socketRef.current) socketRef.current.close();
            if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        };
    }, []);

    const connectWebSocket = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            console.log("Already connected");
            return;
        }

        setSearching(true);
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const ws = new WebSocket(`${protocol}//${window.location.host}/api/ws`);

        ws.onopen = () => {
            console.log("Connected to server, waiting for opponent...");
            socketRef.current = ws;
        };

        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data); // parse JSON

                switch (msg.event) {
                    // I am unsure if we want chat functionality, but in case we do
                    case "chat":
                        console.log("Chat message:", msg.data);
                        break;

                    // Opponent plays a card
                    case "play":
                        setLastOpponentCard(msg.data.card);
                        // Only setting opponents deck size down by 1, need to update this properly for war and for winning/ losing
                        setOpponentDeckCount((prev) => prev - 1); // decrement opponent deck
                        break;

                    // Opponent sends three cards due to a war
                    case "war":
                        console.log("Move received:", msg.data.x, msg.data.y);
                        break;

                    // Opponent joined the game
                    case "joined":
                        console.log("Game started!", msg.data);
                        setConnected(true);
                        setSearching(false);
                        break;

                    default:
                        console.warn("Unknown event:", msg);
                }
            } catch (err) {
                console.error("Failed to parse message", err, event.data);
            }
        };

        ws.onclose = () => {
            console.log("Disconnected");
            setConnected(false);
            setSearching(false);
            socketRef.current = null;
        };

        // store the socket reference
        socketRef.current = ws;

        pingIntervalRef.current = setInterval(() => {
            if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
                clearInterval(pingIntervalRef.current!);
                pingIntervalRef.current = null;
                return;
            }
            socketRef.current.send(JSON.stringify({ event: "ping" }));
        }, 29000);
    };

    const disconnectWebSocket = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.close();
            socketRef.current = null;
        }
        if (pingIntervalRef.current) {
            clearInterval(pingIntervalRef.current);
            pingIntervalRef.current = null;
        }
        setConnected(false);
    };

    const playCard = (card: string) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({event: "play", data: card}));
        }
    };

    return (
        <div>
            {!connected ?
                <div>
                    <button onClick={connectWebSocket} disabled={connected || searching}>
                        {searching ? "Searching..." : "Play"}
                    </button>
                    <button onClick={disconnectWebSocket} disabled={!connected}>
                        Disconnect
                    </button>
                    <p>Status: {connected ? "Connected" : "Disconnected"}</p>
                </div>
                :
                <div>
                    {/*Deck should come from server, when connection is made*/}
                    <GameClient
                        deck={["1h", "1c", "8d", "4s", "2d"]}
                        onPlay={playCard}
                        onPlayEnd={disconnectWebSocket}
                        opponentDeckCount={opponentDeckCount}
                        lastOpponentCard={lastOpponentCard}
                    />
                </div>
            }
        </div>
    );
}
