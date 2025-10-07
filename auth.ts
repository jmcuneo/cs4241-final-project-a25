import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async redirect({ url, baseUrl }) {
            // Always redirect to /start after sign in
            return `${baseUrl}/start`
        },
        async session({ session, token }) {
            // Add GitHub username (login)
            session.user.username = token.username;
            return session;
        },
        async jwt({ token, account, profile }) {
            if (profile) {
                token.username = profile.login; // GitHub username
            }
            return token;
        },
    },
})