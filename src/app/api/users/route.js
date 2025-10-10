import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function POST(request) {
    try {
        const client = await clientPromise;
        const db = client.db("studi");
        const body = await request.json();

        const { name, email, major, gradYear, preferredLanguage, password, confirmPassword } = body;

        // Validate required fields
        if (!name || !email || !major || !gradYear || !preferredLanguage || !password || !confirmPassword) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await db.collection("user").findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Store user WITHOUT hashing the password
        const newUser = {
            name,
            email,
            major,
            gradYear,
            preferredLanguage,
            password, // plain text password
            createdAt: new Date(),
        };

        await db.collection("user").insertOne(newUser);

        return NextResponse.json({ message: "User created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
