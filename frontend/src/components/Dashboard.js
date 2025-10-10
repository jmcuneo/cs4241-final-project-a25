import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
    const [bets, setBets] = useState([]);
    const [betsLoading, setBetsLoading] = useState(true);
    const { currentUser, loading } = useAuth();

    useEffect(() => {
        if (currentUser) {
            fetchBets();
        }
    }, [currentUser]);

    const fetchBets = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/bets');
            setBets(response.data);
        } catch (error) {
            console.error('Error fetching bets:', error);
        } finally {
            setBetsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'won': return 'text-green-600';
            case 'lost': return 'text-red-600';
            default: return 'text-yellow-600';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'won': return 'Won';
            case 'lost': return 'Lost';
            default: return 'Pending';
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading user data...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (betsLoading) {
        return (
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading your bets...</p>
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
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-2 text-gray-600">
                        Welcome back, {currentUser?.username}! Here's your betting overview.
                    </p>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Available Balance</dt>
                                    <dd className="text-lg font-medium text-gray-900">${currentUser?.balance || 0}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Betting History */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Betting History</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            All your placed bets and their current status.
                        </p>
                    </div>
                    <div className="border-t border-gray-200">
                        {bets.length === 0 ? (
                            <div className="px-4 py-12 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No bets placed</h3>
                                <p className="mt-1 text-sm text-gray-500">Get started by placing your first bet!</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {bets.map((bet) => (
                                    <li key={bet._id} className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                                        bet.status === 'won' ? 'bg-green-100' :
                                                            bet.status === 'lost' ? 'bg-red-100' : 'bg-yellow-100'
                                                    }`}>
                            <span className={`text-sm font-medium ${
                                bet.status === 'won' ? 'text-green-800' :
                                    bet.status === 'lost' ? 'text-red-800' : 'text-yellow-800'
                            }`}>
                              {bet.status === 'won' ? 'W' : bet.status === 'lost' ? 'L' : 'P'}
                            </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{bet.eventName}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {bet.selection} @ {bet.odds > 0 ? '+' : ''}{bet.odds}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="text-right">
                                                    <div className="text-sm font-medium text-gray-900">${bet.stake}</div>
                                                    <div className="text-sm text-gray-500">Stake</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-medium text-gray-900">${bet.potentialWin}</div>
                                                    <div className="text-sm text-gray-500">To Win</div>
                                                </div>
                                                <div className={`text-sm font-medium ${getStatusColor(bet.status)}`}>
                                                    {getStatusText(bet.status)}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;