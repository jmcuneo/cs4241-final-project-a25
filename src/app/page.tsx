"use client";
import { useGame } from "./hooks/useGame";
import PlayerArea from "@/components/PlayerArea";
import '@/app/styles/GameBoard.css';

export default function Home() {
    const {
        player1Hand,
        player2Hand,
        player1Played,
        player2Played,
        playCard
    } = useGame();

    return (
        <>
        <div className="game-board">
            <PlayerArea
                playerName="Player 1"
                hand={player1Hand}
                playedCards={player1Played}
                onPlayCard={() => playCard(1)}
            />
            <PlayerArea
                playerName="Player 2"
                hand={player2Hand}
                playedCards={player2Played}
                onPlayCard={() => playCard(2)}
            />
        </div>
        </>
    );
}