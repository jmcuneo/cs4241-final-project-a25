import React, { useState, useEffect } from 'react';

function CountdownTimer({ targetDate, intervalSec = 10, refreshPage = () => {} }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        // seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());

      if (Object.keys(calculateTimeLeft()).length === 0) {
        refreshPage()
      }
    }, 1000 * intervalSec);

    return () => clearTimeout(timer); // Cleanup
  }, [targetDate, timeLeft, refreshPage]); // Dependencies

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval]) {
      return null;
    }
    return (
      <span key={interval}>
        {timeLeft[interval]} {interval}{' '}
      </span>
    );
  });

  return (
    <div>
      {timerComponents.length ? timerComponents : <span>Now.</span>}
    </div>
  );
}

export default CountdownTimer;