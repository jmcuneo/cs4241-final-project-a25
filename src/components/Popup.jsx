import { useEffect } from 'react';
import '../styles/Popup.css';

export default function Popup({ message, duration = 1500, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className="popup">
            {message}
        </div>
    );
}