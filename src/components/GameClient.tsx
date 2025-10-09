"use client"
import {useState, useEffect} from "react";
import PlayerArea from "@/components/PlayerArea";
import {Card} from "@/app/types";

interface GameClientProps {
    deck: string[];
    onPlay: (card: string) => void;
    onPlayEnd: () => void;
    opponentDeckCount?: number; // optional: from server
    lastOpponentCard?: string;  // optional: from server
}

export default function GameClient(props: GameClientProps) {
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
}
