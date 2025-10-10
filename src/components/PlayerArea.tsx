import { Card } from "@/app/types";
import PlayingCard from "./PlayingCard";

interface PlayerAreaProps {
    deck: number;
    isPlayer: boolean;
    playedCards: Card[];
    winCount?: number;
    onPlayCard?: () => void;
    backTheme?: "nordic" | "egyptian";
}

const PlayerArea = ({ isPlayer, deck, playedCards, winCount = 0, onPlayCard, backTheme }: PlayerAreaProps) => {

    return (
        <div className="flex justify-center items-center gap-6 w-full max-w-3xl">
            {/* Left: Draw Deck */}
            <div
                className={`card-container ${isPlayer && onPlayCard ? "cursor-pointer hover:scale-105 transition-transform" : ""}`}
                onClick={onPlayCard}
            >
                {isPlayer && deck > 0 ? (
                    <PlayingCard rank="1" suit="h" faceUp={false} backTheme={backTheme} />
                ) : (
                    <div className="w-20 h-28 bg-gray-600/40 rounded-xl border border-gray-400 flex items-center justify-center text-sm">
                        Empty
                    </div>
                )}
            </div>

            {/* Middle: Played Cards */}
            <div className="flex gap-2 justify-center items-center min-w-[80px]">
                {playedCards.map((card, index) => (
                    <PlayingCard key={index} {...card} faceUp={true} />
                ))}
            </div>

            {/* Right: Win Pile */}
            <div className="flex flex-col items-center">
                <div className="relative">
                    {[...Array(Math.min(winCount, 5))].map((_, i) => (
                        <div
                            key={i}
                            className="absolute"
                            style={{
                                top: `${i * 3}px`,
                                left: `${i * 3}px`,
                                zIndex: i,
                            }}
                        >
                            <PlayingCard rank="1" suit="s" faceUp={false} backTheme={backTheme} />
                        </div>
                    ))}
                    {winCount === 0 && (
                        <div className="w-20 h-28 bg-gray-600/30 rounded-xl border border-gray-400 flex items-center justify-center text-sm">
                            Empty
                        </div>
                    )}
                </div>
                <p className="text-sm mt-1">Wins: {winCount}</p>
            </div>
        </div>
    );
};

export default PlayerArea;
