import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../utils/api';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboard();
        setLeaderboard(data);
        setError(null);
      } catch (err) {
        setError('Failed to load leaderboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div className="nes-container with-title is-centered leaderboard-container"><p className="title">Leaderboard</p><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="nes-container with-title is-centered leaderboard-container"><p className="title">Leaderboard</p><p className="nes-text is-error">{error}</p></div>;
  }

  return (
    <div className="nes-container with-title is-centered leaderboard-container">
      <p className="title">Leaderboard</p>
      {leaderboard.length === 0 ? (
        <p>No scores yet!</p>
      ) : (
        <table className="nes-table is-bordered is-centered">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Pizzas Sold</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry._id}>
                <td>{index + 1}</td>
                <td>{entry.username}</td>
                <td>{entry.pizzasSold}</td>
                <td>${entry.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;