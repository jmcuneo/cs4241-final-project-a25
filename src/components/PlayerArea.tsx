import {Card} from "@/app/types";
import PlayingCard from "./PlayingCard";

interface PlayerAreaProps {
    playerName: string;
    deck: number;
    playedCards: Card[];
    onPlayCard?: () => void;
    backTheme?: "nordic" | "egyptian";
}

const PlayerArea = ({playerName, deck, playedCards, onPlayCard, backTheme}: PlayerAreaProps) => {
    return (
        <div className="player-area">
            <div className="player-pile">
                <h2>{playerName} deck ({deck})</h2>
                {deck > 0 && (
                    <div className="card-container" onClick={onPlayCard}>
                        <PlayingCard
                            rank={"1"}
                            suit={"h"}
                            faceUp={false}
                            backTheme={backTheme}
                        />
                    </div>
                )}
            </div>
            <div className="played-cards">
                {playedCards.map((card, index) => (
                    <PlayingCard key={index} {...card} faceUp={true}/>
                ))}
            </div>
        </div>
    );
};

export default PlayerArea;