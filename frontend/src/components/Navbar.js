import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const location = useLocation();

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="bg-green-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/dashboard" className="text-xl font-bold">
                            SportsBet
                        </Link>
                        <div className="hidden md:flex space-x-4">
                            <Link
                                to="/dashboard"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    location.pathname === '/dashboard'
                                        ? 'bg-green-700 text-white'
                                        : 'text-green-100 hover:bg-green-700'
                                }`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/betting"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    location.pathname === '/betting'
                                        ? 'bg-green-700 text-white'
                                        : 'text-green-100 hover:bg-green-700'
                                }`}
                            >
                                Place Bets
                            </Link>
                            <Link
                                to="/about"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    location.pathname === '/about'
                                        ? 'bg-green-700 text-white'
                                        : 'text-green-100 hover:bg-green-700'
                                }`}
                            >
                                About
                            </Link>

                            <Link
                                to="/leaderboard"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    location.pathname === '/leaderboard'
                                        ? 'bg-green-700 text-white'
                                        : 'text-green-100 hover:bg-green-700'
                                }`}
                            >
                                Leaderboard
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {currentUser ? (
                            <>
                                <div className="text-sm">
                                    Balance: <span className="font-bold">${currentUser.balance}</span>
                                </div>
                                <div className="text-sm">
                                    Welcome, <span className="font-bold">{currentUser.username}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="bg-green-700 hover:bg-green-800 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex space-x-2">
                                <Link
                                    to="/login"
                                    className="bg-green-700 hover:bg-green-800 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-green-800 hover:bg-green-900 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;