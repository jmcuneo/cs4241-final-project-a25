import clientPromise from "@/lib/db";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { username, password } = await req.json();
    if (!username || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("studi");

    const existing = await db.collection("user").findOne({ username });
    if (existing) return NextResponse.json({ error: "User already exists" }, { status: 400 });

    const hashed = await hash(password, 10);
    await db.collection("user").insertOne({ username, password: hashed });

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
}
