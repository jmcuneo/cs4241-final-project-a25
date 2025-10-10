import React, {useState, useEffect} from 'react';

const Timer = ({ duration, onTimeUp}) => {
    const [timeRemaining, setTimeRemaining] = useState(duration);
    const [isRunning, setIsRunning] = useState(false);

    // Auto-start the timer when the component mounts
    useEffect(() => {
        setIsRunning(true);
    }, []);

    useEffect(() => {
        let timerInterval;

        if (isRunning && timeRemaining > 0) {
            timerInterval = setInterval(() => {
                setTimeRemaining((prev) => prev - 1);
            }, 1000);
        }

        if (timeRemaining === 0) {
            clearInterval(timerInterval);
            setIsRunning(false);
            if (onTimeUp) onTimeUp();
        }

        return () => clearInterval(timerInterval);
    }, [isRunning, timeRemaining, onTimeUp]);

    const toggleTimer = () => {
        setIsRunning((prev) => !prev);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    return (
        <div
            className="nes-container is-rounded is-dark"
            style={{
                width: '200px',
                margin: '10px auto',
                textAlign: 'center',
                padding: '10px',
            }}
        >
            <h3 className="nes-text is-warning">Timer</h3>
            <p
                style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    margin: '10px 0',
                }}
            >
                {formatTime(timeRemaining)}
            </p>

            <button
                type="button"
                className={`nes-btn is-warning`}
                onClick={toggleTimer}
            >
                Pause
            </button>

            {/* Overlay for paused state */}
            {!isRunning && timeRemaining !== duration && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        zIndex: 1000,
                    }}
                >
                    <div
                        className="nes-container is-rounded is-dark"
                        style={{
                            textAlign: 'center',
                            padding: '35px',
                            fontSize: '1.5rem',
                        }}
                    >
                        <h2 className="nes-text is-warning">Paused</h2>
                        <button
                            type="button"
                            className="nes-btn is-success"
                            onClick={toggleTimer}
                        >
                            Resume
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Timer;