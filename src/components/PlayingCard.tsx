import React from 'react';
import '@/app/styles/PlayingCard.css';

type CardProps = {
    suit: string;
    rank: string;
    faceUp: boolean;
    onClick?: () => void;
};


const PlayingCard = ({suit, rank, faceUp, onClick}: CardProps) => {

    //card color by suit
    const colorClass = (suit === '♥' || suit === '♦') ? 'red' : 'black';

    const cardClasses = `card ${!faceUp ? 'is-flipped' : ''}`;

    return (
        <div className="card-container" onClick={onClick}>
            <div className={cardClasses}>
                {/* front */}
                <div className={`card-face card-front ${colorClass}`}>
                    <div className="rank top-left">{rank}</div>
                    <div className="suit">{suit}</div>
                    <div className="rank bottom-right">{rank}</div>
                </div>

                {/* back */}
                <div className="card-face card-back"></div>
            </div>
        </div>
    );
};

export default PlayingCard;