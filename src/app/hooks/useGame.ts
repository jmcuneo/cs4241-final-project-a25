import { useState, useEffect } from "react";
import { Card } from "../types";
import { createDeck, shuffleDeck } from "../utils/deck";

export const useGame = () => {
    const [player1Hand, setPlayer1Hand] = useState<Card[]>([]);
    const [player2Hand, setPlayer2Hand] = useState<Card[]>([]);
    const [player1Played, setPlayer1Played] = useState<Card[]>([]);
    const [player2Played, setPlayer2Played] = useState<Card[]>([]);

    //split cards between players
    useEffect(() => {
        const fullDeck = shuffleDeck(createDeck());
        setPlayer1Hand(fullDeck.slice(0, 26));
        setPlayer2Hand(fullDeck.slice(26, 52));
    }, []);

    //flip card & display
    const playCard = (playerNumber: number) => {
        if (playerNumber === 1 && player1Hand.length > 0) {
            const playedCard = player1Hand[0];
            setPlayer1Hand(player1Hand.slice(1));
            setPlayer1Played([...player1Played, playedCard]);
        } else if (playerNumber === 2 && player2Hand.length > 0) {
            const playedCard = player2Hand[0];
            setPlayer2Hand(player2Hand.slice(1));
            setPlayer2Played([...player2Played, playedCard]);
        }
    };

    return {
        player1Hand,
        player2Hand,
        player1Played,
        player2Played,
        playCard,
    };
};