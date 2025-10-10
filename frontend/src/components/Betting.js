import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Betting = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedBet, setSelectedBet] = useState(null);
    const [stake, setStake] = useState('');
    const [message, setMessage] = useState('');
    const { currentUser, updateBalance } = useAuth();

    useEffect(() => {
        fetchOdds();
    }, []);

    const fetchOdds = async () => {
        try {
            console.log('Fetching odds from API...');
            const response = await axios.get('http://localhost:5000/api/odds');
            console.log('Odds data received:', response.data);
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching odds:', error);
            setMessage('Error loading odds. Using demo data.');
        } finally {
            setLoading(false);
        }
    };

    const formatOdds = (odds) => {
        return odds > 0 ? `+${odds}` : odds.toString();
    };

    const calculatePotentialWin = (odds, stakeAmount) => {
        if (odds > 0) {
            return (stakeAmount * (odds / 100)).toFixed(2);
        } else {
            return (stakeAmount * (100 / Math.abs(odds))).toFixed(2);
        }
    };

    const handlePlaceBet = async () => {
        if (!selectedBet || !stake) {
            setMessage('Please select a bet and enter a stake amount');
            return;
        }

        const stakeAmount = parseFloat(stake);
        if (isNaN(stakeAmount) || stakeAmount < 1) {
            setMessage('Minimum stake is $1');
            return;
        }

        if (stakeAmount > currentUser.balance) {
            setMessage('Insufficient balance');
            return;
        }

        try {
            console.log('Placing bet with data:', {
                eventId: selectedEvent.id,
                eventName: selectedEvent.name,
                betType: selectedBet.type,
                selection: selectedBet.team || selectedBet.type,
                odds: selectedBet.odds,
                stake: stakeAmount
            });

            const response = await axios.post('http://localhost:5000/api/bets', {
                eventId: selectedEvent.id,
                eventName: selectedEvent.name,
                betType: selectedBet.type,
                selection: selectedBet.team || selectedBet.type,
                odds: selectedBet.odds,
                stake: stakeAmount
            });

            console.log('Bet placed successfully:', response.data);

            updateBalance(response.data.user.balance);
            setMessage('Bet placed successfully!');
            setStake('');
            setSelectedBet(null);

            setTimeout(() => setMessage(''), 3000);

        } catch (error) {
            console.error('Error placing bet:', error);
            if (error.response) {
                setMessage(`Error: ${error.response.data.message || 'Failed to place bet'}`);
            } else if (error.request) {
                setMessage('Network error - please check if backend is running');
            } else {
                setMessage('Unexpected error occurred');
            }
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading live odds...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Place Your Bets</h1>
                    <p className="mt-2 text-gray-600">
                        Browse available events and place your virtual coin bets.
                    </p>
                </div>

                {message && (
                    <div className={`mb-4 p-4 rounded-md ${
                        message.includes('Error') || message.includes('error') || message.includes('Failed') || message.includes('Insufficient')
                            ? 'bg-red-100 border border-red-400 text-red-700'
                            : 'bg-green-100 border border-green-400 text-green-700'
                    }`}>
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Live Events</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Select an event to view betting options
                                </p>
                            </div>
                            <div className="border-t border-gray-200">
                                <ul className="divide-y divide-gray-200">
                                    {events.map((event) => (
                                        <li key={event.id}>
                                            <button
                                                onClick={() => {
                                                    setSelectedEvent(event);
                                                    setSelectedBet(null);
                                                    setStake('');
                                                }}
                                                className={`w-full text-left p-6 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out ${
                                                    selectedEvent?.id === event.id ? 'bg-blue-50' : ''
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-medium text-gray-900">{event.name}</h4>
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            {new Date(event.date).toLocaleDateString()} • {new Date(event.date).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white shadow sm:rounded-lg sticky top-4">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                    {selectedEvent ? selectedEvent.name : 'Select an Event'}
                                </h3>

                                {selectedEvent && (
                                    <div className="space-y-4">
                                        {selectedEvent.odds.moneyline && selectedEvent.odds.moneyline.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 mb-2">Moneyline</h4>
                                                <div className="space-y-2">
                                                    {selectedEvent.odds.moneyline.map((odds, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setSelectedBet({ ...odds, type: 'moneyline' })}
                                                            className={`w-full text-left p-3 border rounded-md transition-colors ${
                                                                selectedBet?.team === odds.team && selectedBet?.type === 'moneyline'
                                                                    ? 'border-green-500 bg-green-50'
                                                                    : 'border-gray-300 hover:border-gray-400'
                                                            }`}
                                                        >
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm font-medium text-gray-900">{odds.team}</span>
                                                                <span className={odds.odds > 0 ? 'text-green-600' : 'text-red-600'}>
                                                                    {formatOdds(odds.odds)}
                                                                </span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {selectedEvent.odds.spread && selectedEvent.odds.spread.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 mb-2">Spread</h4>
                                                <div className="space-y-2">
                                                    {selectedEvent.odds.spread.map((odds, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setSelectedBet({ ...odds, type: 'spread' })}
                                                            className={`w-full text-left p-3 border rounded-md transition-colors ${
                                                                selectedBet?.team === odds.team && selectedBet?.type === 'spread'
                                                                    ? 'border-green-500 bg-green-50'
                                                                    : 'border-gray-300 hover:border-gray-400'
                                                            }`}
                                                        >
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    {odds.team} ({odds.spread > 0 ? '+' : ''}{odds.spread})
                                                                </span>
                                                                <span className={odds.odds > 0 ? 'text-green-600' : 'text-red-600'}>
                                                                    {formatOdds(odds.odds)}
                                                                </span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {selectedEvent.odds.total && selectedEvent.odds.total.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 mb-2">Total Points</h4>
                                                <div className="space-y-2">
                                                    {selectedEvent.odds.total.map((odds, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setSelectedBet({ ...odds, type: 'total' })}
                                                            className={`w-full text-left p-3 border rounded-md transition-colors ${
                                                                selectedBet?.type === odds.type && selectedBet?.type === 'total'
                                                                    ? 'border-green-500 bg-green-50'
                                                                    : 'border-gray-300 hover:border-gray-400'
                                                            }`}
                                                        >
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    {odds.type} {odds.points}
                                                                </span>
                                                                <span className={odds.odds > 0 ? 'text-green-600' : 'text-red-600'}>
                                                                    {formatOdds(odds.odds)}
                                                                </span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {selectedBet && (
                                            <div className="mt-6 p-4 bg-gray-50 rounded-md">
                                                <h4 className="text-sm font-medium text-gray-900 mb-3">Your Bet</h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Selection:</span>
                                                        <span className="font-medium">
                                                            {selectedBet.team || selectedBet.type} {selectedBet.points && `(${selectedBet.points})`}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Odds:</span>
                                                        <span className={selectedBet.odds > 0 ? 'text-green-600' : 'text-red-600'}>
                                                            {formatOdds(selectedBet.odds)}
                                                        </span>
                                                    </div>
                                                    <div className="pt-2">
                                                        <label htmlFor="stake" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Stake Amount
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id="stake"
                                                            min="1"
                                                            max={currentUser.balance}
                                                            step="1"
                                                            value={stake}
                                                            onChange={(e) => setStake(e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                                                            placeholder="Enter stake amount"
                                                        />
                                                    </div>
                                                    {stake && !isNaN(stake) && parseFloat(stake) >= 1 && (
                                                        <div className="flex justify-between pt-2 border-t border-gray-200">
                                                            <span className="text-gray-600">To Win:</span>
                                                            <span className="font-medium text-green-600">
                                                                ${calculatePotentialWin(selectedBet.odds, parseFloat(stake))}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={handlePlaceBet}
                                                        disabled={!stake || parseFloat(stake) < 1 || parseFloat(stake) > currentUser.balance}
                                                        className="w-full mt-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md transition-colors"
                                                    >
                                                        Place Bet
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Betting;