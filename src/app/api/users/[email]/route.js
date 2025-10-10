import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

// GET user by email
export async function GET(req, { params }) {
    try {
        const email = await params.email; // destructure email from params
        const client = await clientPromise;
        const db = client.db("studi");

        const user = await db.collection("user").findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Convert _id to string for frontend
        const userData = {
            ...user,
            _id: user._id.toString(),
        };

        return NextResponse.json(userData, { status: 200 });
    } catch (err) {
        console.error("Error fetching user:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
} 
