import clientPromise from "@/lib/db";
import { NextResponse } from "next/server";
import formDataToVector from "@/utils/formDataToVector";
import { ObjectId } from "mongodb";

export async function POST(req) {
    const getDistance = function (inputVector, candidateVector) {
        return Math.sqrt(
            inputVector.reduce((sum, value, index) => sum + Math.pow(value - candidateVector[index], 2), 0)
        );
    }

    const getBestNMatches = function (inputVector, candidateVectors, n) {
        const distances = candidateVectors.map(candidate => ({
            form: candidate.form,
            distance: getDistance(inputVector, candidate.vector)
        }));
        const sortedMatches = distances.sort((a, b) => a.distance - b.distance);
        return sortedMatches.slice(0, n);
    }

    const target = await req.json();

    try {
        const {
            course,
            personality,
            priority,
            assignment,
            communicationStyle,
            noiseLevel,
            isOnline,
            timeOfDay,
            studyPace,
            breakStyle,
            userId,
            id,
        } = target;

        const inputVector = formDataToVector({
            course,
            personality,
            priority,
            assignment,
            communicationStyle,
            noiseLevel,
            isOnline,
            timeOfDay,
            studyPace,
            breakStyle,
        });

        const client = await clientPromise;
        const db = client.db("studi");
        const formCollection = db.collection("form");
        const userCollection = db.collection("user");

        const formsFromSameClass = await formCollection
            .find({ course: course })
            .toArray();
            
        // Filter out the current user's forms
        const candidateForms = formsFromSameClass.filter(
            (f) => f.userId !== userId
        );

        const candidateVectors = candidateForms.map((form) => ({
            form: form,
            vector: formDataToVector(form),
        }));

        // Get best matches
        const bestMatches = getBestNMatches(inputVector, candidateVectors, 6);

        // Fetch user data for each match
        const userIds = bestMatches.map(
            (match) => new ObjectId(match.form.userId)
        );
        const users = await userCollection
            .find({ _id: { $in: userIds } })
            .toArray();

        // Create a map of userId to user data (without password)
        const userMap = {};
        users.forEach((user) => {
            const { password, ...userWithoutPassword } = user;
            userMap[user._id.toString()] = {
                ...userWithoutPassword,
                _id: user._id.toString(),
            };
        });

        // Add user data to each match
        const matchesWithUsers = bestMatches.map((match) => ({
            user: userMap[match.form.userId] || null,
            form: match.form,
            distance: match.distance,
        }));

        const matchBatchCollection = db.collection("match_batch");
        await matchBatchCollection.insertOne({
            target: target,
            targetId: id,
            bestMatches: matchesWithUsers,
            createdAt: new Date(),
        });

        console.log({
            target: target,
            targetId: id,
            bestMatches: matchesWithUsers,
            createdAt: new Date(),
        });
        console.log("Match batch inserted");

        return new NextResponse(
            JSON.stringify({
                success: true,
                matches: matchesWithUsers.map((match) => ({
                    user: match.user,
                    ...match.form,
                    matchScore: match.distance,
                })),
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    } catch(err) {
        console.error(err);

        return new NextResponse(JSON.stringify({success: false}), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        })
    }
}

export async function GET(req) {
    try {
        const client = await clientPromise;
        const db = client.db("studi");

        const { searchParams } = new URL(req.url);
        const target = searchParams.get('targetForm');

        if (!target) {
            return new NextResponse(JSON.stringify({
                success: false,
                error: "Target parameter required"
            }), { status: 400 });
        }

        const matchBatch = await db.collection("match_batch").findOne({ targetId: target.trim() });

        return new NextResponse(
            JSON.stringify({
                success: true,
                matchBatch: matchBatch,
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch(err) {
        console.error(err);

        return new NextResponse(JSON.stringify({success: false}), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        })
    }
}