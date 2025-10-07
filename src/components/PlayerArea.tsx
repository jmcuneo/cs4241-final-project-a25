import { Card } from "@/app/types";
import PlayingCard from "./PlayingCard";

interface PlayerAreaProps {
    playerName: string;
    hand: Card[];
    playedCards: Card[];
    onPlayCard: () => void;
    backTheme?: "nordic" | "egyptian";
}

const PlayerArea = ({ playerName, hand, playedCards, onPlayCard, backTheme }: PlayerAreaProps) => {
    return (
        <div className="player-area">
        <div className="player-pile">
            <h2>{playerName} Hand ({hand.length})</h2>
            {hand.length > 0 && (
            <div className="card-container" onClick={onPlayCard}>
                <PlayingCard
                {...hand[0]}
                faceUp={false}
                backTheme={backTheme}
                />
            </div>
            )}
        </div>
        <div className="played-cards">
            {playedCards.map((card, index) => (
            <PlayingCard key={index} {...card} faceUp={true} />
            ))}
        </div>
        </div>
    );
};

export default PlayerArea;