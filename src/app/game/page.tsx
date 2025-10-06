"use client";
import { useEffect, useState } from "react";
import { useGame } from "../hooks/useGame";
import PlayerArea from "@/components/PlayerArea";
import '@/app/styles/GameBoard.css';

type DeckTheme = "nordic" | "egyptian" | undefined;

export default function GamePage() {
  const {
    player1Hand,
    player2Hand,
    player1Played,
    player2Played,
    playCard
  } = useGame();

  const [deckTheme, setDeckTheme] = useState<DeckTheme>(undefined);

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("deckTheme")) as DeckTheme;
    setDeckTheme(saved || undefined);
  }, []);

  return (
    <div className="game-board">
      <PlayerArea
        playerName="Player 1"
        hand={player1Hand}
        playedCards={player1Played}
        onPlayCard={() => playCard(1)}
        backTheme={deckTheme === "egyptian" ? "egyptian" : "nordic"}
      />
      <PlayerArea
        playerName="Player 2"
        hand={player2Hand}
        playedCards={player2Played}
        onPlayCard={() => playCard(2)}
        backTheme={deckTheme === "egyptian" ? "egyptian" : "nordic"}
      />
    </div>
  );
}