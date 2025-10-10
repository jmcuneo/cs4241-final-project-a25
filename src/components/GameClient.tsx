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

// Previous Version of GameClient functioanlity

/* export default function GameClient ({
    const [pDeck, setpDeck] = useState<string[]>(props.deck);
    const [lastPlayerCard, setLastPlayerCard] = useState<string | undefined>(undefined);

    const playTopCard = () => {
        if (pDeck.length === 0) return; // nothing to play
        const topCard = pDeck[0]; // take the top card
        setpDeck(pDeck.slice(1));  // remove the top card
        props.onPlay(topCard);
    };

    const convertToCard = (cardStr: string | undefined): Card => {
        if (!cardStr || cardStr.length < 2) {
            return {suit: "", rank: ""};
        }

        const suitChar = cardStr[0];
        const rankStr = cardStr.slice(1);
        return { suit: suitChar, rank: rankStr };
    };

    return (
        <div className="game-board">
            <PlayerArea
                playerName={`Opponent`}
                deck={props.opponentDeckCount ? props.opponentDeckCount : 26} // Need to make this take just a number,
                playedCards={[convertToCard(props.lastOpponentCard)]}
                // backTheme={deckTheme === "egyptian" ? "egyptian" : "nordic"}
            />

            <PlayerArea
                playerName={`You`}
                deck={pDeck.length}
                onPlayCard={playTopCard}
                playedCards={[convertToCard(lastPlayerCard)]}
                // backTheme={deckTheme === "egyptian" ? "egyptian" : "nordic"}
            />
        </div>
    );
}*/

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
