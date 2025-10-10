import React from 'react';
import OrderCard from './OrderCard';

export default function OrderList({ orders }) {
    return (
        <div
            className="nes-container is-rounded with-title"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                gap: '20px',
                padding: '10px',
                flexWrap: 'wrap',
                backgroundColor: '#f9f9f9',
            }}
        >
            {orders.map(order => (
                <OrderCard key={order.id} order={order} />
            ))}
        </div>
    );
}