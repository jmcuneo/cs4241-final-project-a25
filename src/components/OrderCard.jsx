import React from 'react';
import 'nes.css/css/nes.min.css';
import sauceIcon from '../sprites/sauceIcon.png';
import cheeseIcon from '../sprites/cheeseIcon.png';
import pepperoniIcon from '../sprites/pepperoniIcon.png';
import mushroomIcon from '../sprites/mushroomIcon.png';
import oliveIcon from '../sprites/oliveIcon.png';
import pepperIcon from '../sprites/pepperIcon.png';

const TOPPING_SPRITES = {
    sauce: sauceIcon,
    cheese: cheeseIcon,
    pepperoni: pepperoniIcon,
    mushroom: mushroomIcon,
    olive: oliveIcon,
    pepper: pepperIcon
};

export default function OrderCard({ order }) {
    return (
        <div className="nes-container is-rounded" style={{ width: '380px', height: '190px', margin: '10px', backgroundColor: 'slategray' }}>
            <p className="title">Order #{order.id.slice(0, 4)}</p>

            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '4px',
                    minHeight: '60px',
                    width: '100%',
                }}
            >
                {order.toppings.map((topping, index) => (
                    <div className="toppingIcons" key={index} style={{ textAlign: 'center', fontSize: '10px'}}>
                        <img
                            src={TOPPING_SPRITES[topping]}
                            alt={topping}
                            style={{ width: '24px', height: '24px' }}

                        />
                        <p>{topping}</p>
                    </div>
                ))}
            </div>

            <hr />
            <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
                <i className="nes-icon coin is-small" style={{ marginRight: '5px' }}></i>
                ${order.price.toFixed(2)}
            </p>
        </div>
    );
}