"use client"
// import {useState, useEffect} from "react";
import React from "react";
import PlayerArea from "@/components/PlayerArea";
import {Card} from "@/app/types";

type GameClientProps = {
  deck: string[];
  onPlay: () => void;          // No need for arguments as Game.tsx contains the necessary componenets to handle it
  onPlayEnd: () => void;
  opponentDeckCount?: number;
  lastOpponentCard?: string;
  lastPlayerCard?: string;     
  canPlay?: boolean;           
};

function convertToCard(code?: string): Card {
  if (!code || code.length < 2) return { suit: "", rank: "" };
  const suit = code.slice(-1);             // For the Last character (e.g., 'c' in '10c')
  const rank = code.slice(0, -1);          // Everything before suit/card type (e.g., '10')
  return { suit, rank };
}

// New Changes/Modifications for GameClient function:
export default function GameClient({
    deck,
    onPlay,
    onPlayEnd,
    opponentDeckCount,
    lastOpponentCard,
    lastPlayerCard,
    canPlay = true,
}: GameClientProps) {
    
    const playTopCard = () => {
        if (!canPlay || deck.length === 0) return;
        onPlay();               // No need for card arguements, as Game.tsx will handle it
    };
    return (
    <div className="game-board">
        <PlayerArea
        playerName="Opponent"
        deck={opponentDeckCount ?? 0}
        playedCards={[convertToCard(lastOpponentCard)]}
        // backTheme={deckTheme === "egyptian" ? "egyptian" : "nordic"}
        />
        <PlayerArea
        playerName="You"
        deck={deck.length}
        onPlayCard={playTopCard}
        playedCards={[convertToCard(lastPlayerCard)]}
        // backTheme={deckTheme === "egyptian" ? "egyptian" : "nordic"}
      />
    </div>
  );
}
