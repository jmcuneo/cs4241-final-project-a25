import React from 'react';
import '@/app/styles/PlayingCard.css';

type CardProps = {
    suit: string;
    rank: string;
    faceUp: boolean;
    onClick?: () => void;
    backTheme?: "nordic" | "egyptian";
    small?: boolean;
};

const SUITS = new Map<string, string>([["s", "♠"], ["c", "♣"], ["h", "♥"], ["d", "♦"]]);

const PlayingCard = ({suit, rank, faceUp, onClick, backTheme, small}: CardProps) => {
    const suitIcon = SUITS.get(suit);
    //card color by suit
    const colorClass = (suitIcon === '♥' || suitIcon === '♦') ? 'red' : 'black';

    const cardClasses = `card ${!faceUp ? 'is-flipped' : ''}`;

    const backBase = "card-face card-back-tw relative overflow-hidden";

    const backNordic = `${backBase} bg-gradient-to-br from-sky-900 to-sky-600`;

    const backEgypt = `${backBase} bg-gradient-to-br from-amber-900 to-yellow-700`;

    return (
        <div className={small ? "small-card-container" : "card-container"} onClick={onClick}>
            <div className={cardClasses}>
                {/* front */}
                <div className={`card-face card-front ${colorClass}`}>
                    <div className="select-none rank top-left">{rank}</div>
                    <div className="select-none suit">{suitIcon}</div>
                    <div className="select-none rank bottom-right">{rank}</div>
                </div>

                {/* back (Tailwind themed) */}
                <div
                    className={!backTheme ? "card-face card-back-default" : (backTheme === "nordic" ? backNordic : backEgypt)}
                    style={{transform: "rotateY(180deg)"}}>
                    {backTheme === "nordic" && (
                        <>
                            <div
                                className="absolute inset-0 opacity-25 [background:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:16px_16px]"/>
                            <div className="absolute inset-2 rounded-lg border border-white/30"/>
                            <div className={`select-none ${small ? "text-l" : "text-4xl"}`}>ᚠᚢᚦ</div>
                        </>
                    )}
                    {backTheme === "egyptian" && (
                        <>
                            <div
                                className="absolute inset-0 opacity-20 [background:repeating-linear-gradient(135deg,black,black_6px,transparent_6px,transparent_12px)] mix-blend-soft-light"/>
                            <div className="absolute inset-2 rounded-lg border border-black/30"/>
                            <div className={`select-none ${small ? "text-l" : "text-4xl"}`}>☥</div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlayingCard;