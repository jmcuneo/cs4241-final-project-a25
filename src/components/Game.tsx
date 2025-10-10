"use client"
import {useState, useEffect, useRef} from "react";
import GameClient from "@/components/GameClient";
import Queue from "@/components/Queue";

type Suit = "c" | "d" | "h" | "s";
type Rank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

interface Card {
    code: string;
    rank: Rank;
    suit: Suit;
}

function codeToRank(code: string): Rank {
    const m = code.toLowerCase().match(/^([2-9]|10|[jqka])[cdhs]$/);
    if (!m) throw new Error(`Bad code ${code}`);
    const face = m[1];
    if (face === "j") return 11 as Rank;
    if (face === "q") return 12 as Rank;
    if (face === "k") return 13 as Rank;
    if (face === "a") return 14 as Rank;
    return Number(face) as Rank;
}

function compareCodes(a: string, b: string): -1 | 0 | 1 {
    const ra = codeToRank(a), rb = codeToRank(b);
    if (ra === rb) return 0;
    return ra > rb ? 1 : -1;
}

interface Player {
    drawPile: Card[];
    wonPile: Card[];
}

const WAR_FACE_DOWN_COUNT = 3;

const RANKS: Rank[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const SUITS: Suit[] = ["c", "d", "h", "s"];

function rankToCode(rank: Rank): string {
    if (rank <= 10) return String(rank);
    const faceMap: Record<number, string> = {11: "j", 12: "q", 13: "k", 14: "a"};
    return faceMap[rank];
}

function buildDeck(): Card[] {
    const deck: Card[] = [];
    for (const s of SUITS)
        for (const r of RANKS)
            deck.push({code: `${rankToCode(r)}${s}`, rank: r, suit: s});
    return deck;
}

function shuffle<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function compare(a: Card, b: Card): -1 | 0 | 1 {
    if (a.rank === b.rank) return 0;
    return a.rank > b.rank ? 1 : -1;
}

function canAffordFullWar(p: Player): boolean {
    return p.drawPile.length + p.wonPile.length >= WAR_FACE_DOWN_COUNT + 1;
}

/* interface Game {
    deck: string[];
    onPlay: (card: string) => void;
    onPlayEnd: () => void;
}*/

export default function Game() {
    const [pDeck, setPDeck] = useState<string[]>([]);
    const [canPlay, setCanPlay] = useState(true);
    const [lastPlayerCard, setLastPlayerCard] = useState<string>();
    const [opponentDeckCount, setOpponentDeckCount] = useState<number>();
    const [lastOpponentCard, setLastOpponentCard] = useState<string>();
    const [roomId, setRoomId] = useState<string | null>(null);
    const [playerNumber, setPlayerNumber] = useState<number | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [oppDeck, setOppDeck] = useState<string[]>([]);
    const [gameStatus, setGameStatus] = useState("");
    const [playerName, setPlayerName] = useState<string>("You");
    const [opponentName, setOpponentName] = useState<string>("Opponent");

    const [status, setStatus] = useState<string | undefined>("Connecting...");

    // Your discard pile (won cards you'll reshuffle into draw when empty)
    const [myWon, setMyWon] = useState<string[]>([]);

    // Opponent info mirrored locally
    const [oppDrawCount, setOppDrawCount] = useState<number>(0);
    const [oppWon, setOppWon] = useState<string[]>([]);

    // Cards currently "on the table" (in contention during a war)
    const [table, setTable] = useState<string[]>([]);

    // Marks that we are inside a war resolution so the normal resolver won't re-run
    const [inWar, setInWar] = useState(false);

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    function initializeGame() {
        setPDeck([]); // Remove if server sends the deck
    }

    useEffect(() => {
        const connectWebSocket = () => {
            if (typeof window === "undefined") return;

            const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
            const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);

            ws.onopen = () => {
                console.log('WebSocket connected to port 3001');
                setIsConnected(true);
                setStatus("Waiting for opponent...");
            };

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                switch (message.event) {
                    case "joined": {
                        setRoomId(message.data.roomId ?? null);
                        setPlayerNumber(message.data.player ?? null);
                        setStatus(`Game started! You are Player ${message.data.player}`);

                        if (Array.isArray(message.data.deck)) {
                            // Incase the server is authoritative, it should also send opponent info.
                            setPDeck(message.data.deck);  // server-authoritative deck
                            // Incase the server also sends back the opponentDeck
                            setOppDeck(message.data.opponentDeck);

                        } else {
                            // local fallback for testing:
                            const full = shuffle(buildDeck());    // Card[]
                            const codes = full.map(c => c.code);  // string[]
                            const mine = codes.filter((_, i) =>
                                (message.data.player === 1 ? i % 2 === 0 : i % 2 !== 0)
                            );
                            const theirs = codes.filter((_, i) =>
                                (message.data.player === 1 ? i % 2 !== 0 : i % 2 === 0)
                            );
                            setPDeck(mine);
                            setOppDeck(theirs);
                        }
                        break;
                    }
                    case "play": {
                        setLastOpponentCard(message.data.card);
                        setOpponentDeckCount(message.data.deckCount);
                        setOppDrawCount(message.data.deckCount);
                        break;
                    }
                    case "opponentDisconnected": {
                        setStatus("Opponent disconnected. You win!");
                        break;
                    }
                    default:
                        console.log("Unhandled event:", message.event);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
            ws.onclose = (event) => {
                console.log('WebSocket closed:', event.code, event.reason);
                setIsConnected(false);
                setStatus("Disconnected");

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

    // Draws a card from your deck, and then reshuffles won pile if empty
    function drawFromMine(): string | null {
        if (pDeck.length === 0 && myWon.length > 0) {
            const reshuffled = shuffle(
                myWon.map(code => ({
                    code,
                    rank: codeToRank(code),
                    suit: code.slice(-1) as Suit
                }))
            ).map(c => c.code);
            setMyWon([]); // Moved back into draw
            setPDeck(reshuffled);
        }
        let card: string | null = null;
        setPDeck(prev => {
            if (prev.length === 0) return prev;
            card = prev[0];
            return prev.slice(1);
        });
        return card;
    }

    // Draws a card from the opponent's deck (for testing/client mode)
    function drawFromOpp(): string | null {
        if (oppDeck.length === 0 && oppWon.length > 0) {
            const reshuffled = shuffle(
                oppWon.map(code => ({
                    code,
                    rank: codeToRank(code),
                    suit: code.slice(-1) as Suit
                }))
            ).map(c => c.code);
            setOppWon([]);
            setOppDeck(reshuffled);
        }
        let card: string | null = null;
        setOppDeck(prev => {
            if (prev.length === 0) return prev;
            card = prev[0];
            return prev.slice(1);
        });
        return card;
    }

    function resolveRoundIfReady() {
        if (!lastPlayerCard || !lastOpponentCard) return;
        if (inWar) return; // War flips will be handled by startWar()

        const cmp = compareCodes(lastPlayerCard, lastOpponentCard);

        if (cmp > 0) {
            setMyWon(prev => [...prev, lastPlayerCard, lastOpponentCard]);
            setGameStatus("You won the round!");
            setCanPlay(true);
        } else if (cmp < 0) {
            setOppWon(prev => [...prev, lastPlayerCard, lastOpponentCard]);
            setGameStatus("Opponent won the round");
            setCanPlay(true);
        } else {
            // TIE -> seed the table with the tied face-up cards, enter war
            setTable(prev => [...prev, lastPlayerCard, lastOpponentCard]);
            setInWar(true);
            setGameStatus("War!");
            startWar(); // Kick off 3 down + 1 up logic
        }
    }

    function totalMine() {
        return pDeck.length + myWon.length;
    }

    function totalOpp() {
        return oppDeck.length + oppWon.length;
    }

    // Pays exactly `n` face-down cards using the provided draw() function.
    // Returns false immediately if the player cannot pay the full amount.
    function payFaceDownStrict(
        n: number,
        draw: () => string | null,
        pile: string[]
    ): boolean {
        for (let i = 0; i < n; i++) {
            const c = draw();
            if (!c) return false;     // Cannot complete payment
            pile.push(c);             // And becuse of that it goes back to the table
        }
        return true;
    }

    function startWar() {
        setInWar(true);

        const workingTable = [...table];

        // Check to see if the user has enough cards to play:
        // 3 down cards and 1 up card (4 total cards) each

        const mineTotal = pDeck.length + myWon.length;
        const oppTotal = oppDeck.length + oppWon.length;

        if (mineTotal < WAR_FACE_DOWN_COUNT + 1) {
            setOppWon(prev => [...prev, ...workingTable]);
            setTable([]);
            setInWar(false);
            setCanPlay(true);
            setGameStatus("You couldn't place 3 down. Opponent wins the war.");
            return;
        }
        if (oppTotal < WAR_FACE_DOWN_COUNT + 1) {
            setMyWon(prev => [...prev, ...workingTable]);
            setTable([]);
            setInWar(false);
            setCanPlay(true);
            setGameStatus("Opponent couldn't place 3 down. You win the war!");
            return;
        }

        // First component, each user plays 3 face-down cards.
        // If either plays fails mid-payment, the other player wins immediately.
        if (!payFaceDownStrict(WAR_FACE_DOWN_COUNT, drawFromMine, workingTable)) {
            setOppWon(prev => [...prev, ...workingTable]);
            setTable([]);
            setInWar(false);
            setCanPlay(true);
            setGameStatus("You couldn't place 3 down. Opponent wins the war.");
            return;
        }
        if (!payFaceDownStrict(WAR_FACE_DOWN_COUNT, drawFromOpp, workingTable)) {
            setMyWon(prev => [...prev, ...workingTable]);
            setTable([]);
            setInWar(false);
            setCanPlay(true);
            setGameStatus("Opponent couldn't place 3 down. You win the war!");
            return;
        }

        // Second component: As the player flips up their 1 face-up. 
        // If someone can't flip, they lose immediately.
        const myUp = drawFromMine();
        const oppUp = drawFromOpp();

        if (!myUp && !oppUp) {
            // Incase you both flip your furth card, and have the same value, and
            // also don't have any more cards to play, then the winner
            // will be decided by totals
            const iWin = (pDeck.length + myWon.length) >= (oppDeck.length + oppWon.length);
            if (iWin) setMyWon(prev => [...prev, ...workingTable]); else setOppWon(prev => [...prev, ...workingTable]);
            setTable([]);
            setInWar(false);
            setCanPlay(true);
            setGameStatus(iWin ? "You win the war." : "Opponent wins the war.");
            return;
        }
        if (!myUp) {
            setOppWon(prev => [...prev, ...workingTable]);
            setTable([]);
            setInWar(false);
            setCanPlay(true);
            setGameStatus("You couldn't flip the deciding card. Opponent wins the war.");
            return;
        }
        if (!oppUp) {
            setMyWon(prev => [...prev, ...workingTable]);
            setTable([]);
            setInWar(false);
            setCanPlay(true);
            setGameStatus("Opponent couldn't flip the deciding card. You win the war!");
            return;
        }

        // Now, if you avoid any of the prior issues, and are able to play a proper war
        // You would then put the deciding face-up cards onto the table and show them
        workingTable.push(myUp, oppUp);
        setLastPlayerCard(myUp);
        setLastOpponentCard(oppUp);
        setTable(workingTable);

        // Now we compare deciding cards
        const cmp = compareCodes(myUp, oppUp);
        if (cmp === 0) {
            // Chained war — recurse
            setTimeout(startWar, 0);
            return;
        }
        if (cmp > 0) {
            setMyWon(prev => [...prev, ...workingTable]);
            setGameStatus("You win the war!");
        } else {
            setOppWon(prev => [...prev, ...workingTable]);
            setGameStatus("Opponent wins the war.");
        }
        // Cleanup for next round
        setTable([]);
        setInWar(false);
        setCanPlay(true);
    }

    useEffect(() => {
        if (lastPlayerCard && lastOpponentCard) {
            resolveRoundIfReady();
        }
    }, [lastPlayerCard, lastOpponentCard]);

    function playTopCard() {
        if (!canPlay) return;
        setCanPlay(false);

        // Compute next deck and send WS using the *new* length
        setPDeck(prev => {
            if (prev.length === 0) {
                setCanPlay(true); // nothing to play; re-enable
                return prev;
            }
            const topCard = prev[0];
            const nextDeck = prev.slice(1);

            setLastPlayerCard(topCard);

            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(
                    JSON.stringify({
                        event: "play",
                        data: {
                            card: topCard,
                            deckCount: nextDeck.length, // Use next length, not stale prev
                        },
                    })
                );
            }
            return nextDeck;
        });
    }

    if (!isConnected || status === "Waiting for opponent...") {
        return <Queue/>;
    }

    return (
        <div>
            <GameClient deck={pDeck} onPlay={playTopCard} onPlayEnd={() => {
            }} gameStatus={gameStatus}
                        opponentDeckCount={opponentDeckCount ?? 0} lastOpponentCard={lastOpponentCard}
                        lastPlayerCard={lastPlayerCard}
                        canPlay={canPlay}
                        playerName={playerName}
                        opponentName={opponentName}/>
        </div>
    );
}