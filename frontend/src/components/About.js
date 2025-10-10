import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-green-500 to-green-600">
                    <h1 className="text-3xl font-bold text-white">About SportsBet</h1>
                    <p className="mt-1 text-green-100">Virtual Sports Betting Platform</p>
                </div>

                <div className="border-t border-gray-200">
                    <div className="px-4 py-5 sm:p-6">
                        {/* Introduction */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to SportsBet! 🎯</h2>
                            <p className="text-gray-600 mb-4">
                                SportsBet is a virtual sports betting platform where you can experience the thrill of sports betting
                                without risking real money. Practice your betting strategies, learn about different bet types, and
                                compete with friends - all in a safe, virtual environment.
                            </p>
                        </div>

                        {/* How to Use */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">🚀 How to Get Started</h3>

                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="text-green-600 font-bold">1</span>
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-medium text-gray-900">Create Your Account</h4>
                                        <p className="text-gray-600">
                                            Register for a free account and receive <strong>1,000 virtual coins</strong> to start betting.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="text-green-600 font-bold">2</span>
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-medium text-gray-900">Explore Live Odds</h4>
                                        <p className="text-gray-600">
                                            Browse real NBA games with live odds from FanDuel. View moneyline, spread, and total bets.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="text-green-600 font-bold">3</span>
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-medium text-gray-900">Place Your Bets</h4>
                                        <p className="text-gray-600">
                                            Select a game, choose your bet type, enter your stake, and place your virtual bet.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="text-green-600 font-bold">4</span>
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-medium text-gray-900">Track Your Performance</h4>
                                        <p className="text-gray-600">
                                            Monitor your betting history, track wins and losses, and manage your virtual bankroll.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bet Types Explained */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 Understanding Bet Types</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-green-600 mb-2">💰 Moneyline</h4>
                                    <p className="text-sm text-gray-600">
                                        Bet on which team will win the game outright. Positive odds (+) show potential profit on a $100 bet, negative odds (-) show how much you need to bet to win $100.
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-green-600 mb-2">📈 Point Spread</h4>
                                    <p className="text-sm text-gray-600">
                                        Bet on a team to win by a certain margin. The favorite gives points (-), the underdog gets points (+). Your team must "cover the spread" to win.
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-green-600 mb-2">🎯 Total (Over/Under)</h4>
                                    <p className="text-sm text-gray-600">
                                        Bet on whether the total points scored by both teams will be over or under a specified number. The game score determines if it's over or under.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">⭐ Key Features</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Real-time NBA odds from FanDuel
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Virtual currency system
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Secure user authentication
                                    </li>
                                </ul>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Complete betting history
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Responsive mobile-friendly design
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Live balance updates
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Important Notes */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-800 mb-2">⚠️ Important Notes</h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• This is a simulation platform using virtual currency - no real money is involved</li>
                                <li>• All betting is for entertainment and educational purposes only</li>
                                <li>• Odds are provided by The Odds API and update in real-time</li>
                                <li>• Start with 1,000 virtual coins - manage your bankroll wisely!</li>
                            </ul>
                        </div>

                        {/* Call to Action */}
                        <div className="mt-8 text-center">
                            <Link
                                to="/betting"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                            >
                                Start Betting Now
                            </Link>
                            <p className="mt-2 text-sm text-gray-500">
                                Ready to test your skills? Head to the betting page and place your first virtual bet!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;