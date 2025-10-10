import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/db";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@domain.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    console.log("Checking credentials for:", credentials.email);

                    const client = await clientPromise;
                    const db = client.db("studi");

                    // Find user by email
                    const user = await db.collection("user").findOne({ email: credentials.email });
                    console.log("User found:", user);

                    if (!user) {
                        console.log("No user found with that email");
                        return null;
                    }

                    // Compare plain text passwords
                    if (credentials.password !== user.password) {
                        console.log("Invalid password for:", credentials.email);
                        return null;
                    }

                    console.log("User authenticated successfully:", user.email);

                    // Return user object for NextAuth session
                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                    };
                } catch (error) {
                    console.error("Error during authorization:", error);
                    return null;
                }
            },
        }),
    ],
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
