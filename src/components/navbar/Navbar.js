"use client";

import { UserCircleIcon } from '@heroicons/react/24/solid';
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="w-full h-16 bg-white text-black flex items-center justify-between px-8">
            <div className="flex items-center space-x-6">
                <Link href="/">
                    <img src="logo.png" alt="Logo" width="160" height="20" />
                </Link>
            </div>

            <div className="flex items-center space-x-4">
                <Link
                    href="/form"
                    className="py-2 px-4 rounded hover:underline hover:opacity-80"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, #59EE80, #56E9F1)",
                    }}
                >
                    Find a Study Buddy
                </Link>

                <Link
                    href="/profile"
                    aria-label="Go to Profile"
                    className="hover:opacity-80"
                >
                    <UserCircleIcon className="h-8 w-8" />
                </Link>
            </div>
        </nav>
    );
}
