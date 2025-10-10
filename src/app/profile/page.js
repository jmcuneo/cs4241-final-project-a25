"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status, router]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (session?.user?.email) {
                try {
                    const res = await fetch(`/api/users/${session.user.email}`);
                    const data = await res.json();
                    setUserData(data);

                    // Store user _id in localStorage
                    if (data._id) {
                        localStorage.setItem("userId", data._id);
                    }
                } catch (err) {
                    console.error("Error fetching user data:", err);
                }
            }
        };
        fetchUserData();
    }, [session]);

    if (status === "loading") return <p>Loading...</p>;

    if (status === "authenticated") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black px-4">
                <h1 className="text-4xl font-semibold mb-6">Welcome, {userData?.name || session.user.name}!</h1>

                {userData ? (
                    <div className="w-full max-w-md bg-gray-100 p-6 rounded-lg shadow">
                        <p className="mb-2"><strong>Email:</strong> {userData.email}</p>
                        <p className="mb-2"><strong>Major:</strong> {userData.major}</p>
                        <p className="mb-2"><strong>Graduation Year:</strong> {userData.gradYear}</p>
                        <p className="mb-4"><strong>Preferred Language:</strong> {userData.preferredLanguage}</p>
                    </div>
                ) : (
                    <p>Loading profile data...</p>
                )}

                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="mt-6 py-2 px-4 rounded font-semibold hover:opacity-80"
                    style={{ backgroundImage: "linear-gradient(to right, #59EE80, #56E9F1)", color: "black" }}
                >
                    Sign Out
                </button>
            </div>
        );
    }

    return null;
}
