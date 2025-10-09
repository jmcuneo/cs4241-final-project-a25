import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
    throw new Error('Missing GITHUB_ID or GITHUB_SECRET environment variables')
}

if (!process.env.AUTH_SECRET) {
    throw new Error('Missing AUTH_SECRET environment variable')
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],
    secret: process.env.AUTH_SECRET,
    trustHost: true, // Important for Render deployment
    callbacks: {
        async redirect({ url, baseUrl }) {
            // Always redirect to /start after sign in
            return `${baseUrl}/start`
        },
    },
})