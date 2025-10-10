import clientPromise from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const formData = await req.json();

        if (!formData) {
            return NextResponse.json({ error: "Information is missing" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("studi");
        const collection = db.collection("form");

        const result = await collection.insertOne(formData);

        return NextResponse.json({
            success: true,
            message: "Form submitted successfully",
            id: result.insertedId,
        }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({
            success: false,
            message: "An error occurred while submitting the form",
        }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const client = await clientPromise;
        const db = client.db("studi");

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return new NextResponse(
                JSON.stringify({
                    success: false,
                    error: "userId parameter required",
                }),
                { status: 400 }
            );
        }

        // Find all forms for the user, sorted by course
        const forms = await db
            .collection("form")
            .find({ userId: userId })
            .sort({ course: 1 })
            .toArray();

        // Group forms by course
        const formsByCourse = forms.reduce((acc, form) => {
            const course = form.course;
            if (!acc[course]) {
                acc[course] = [];
            }
            acc[course].push({
                ...form,
                _id: form._id.toString(),
            });
            return acc;
        }, {});

        return new NextResponse(
            JSON.stringify({
                success: true,
                forms: formsByCourse,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (err) {
        console.error(err);

        return new NextResponse(JSON.stringify({ success: false }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}
