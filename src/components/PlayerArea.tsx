import { Card } from "@/app/types";
import PlayingCard from "./PlayingCard";

interface PlayerAreaProps {
    playerName: string;
    hand: Card[];
    playedCards: Card[];
    onPlayCard: () => void;
}

const PlayerArea = ({ playerName, hand, playedCards, onPlayCard }: PlayerAreaProps) => {
    return (
        <div className="player-area">
            <div className="player-pile">
                <h2>{playerName} Hand ({hand.length})</h2>
                {hand.length > 0 && (
                    <PlayingCard
                        {...hand[0]}
                        faceUp={false}
                        onClick={onPlayCard}
                    />
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