"use client"

import { signInWithGithub } from "@/../actions"

export default function SignIn() {
    return (
        <form action={signInWithGithub}>
            <button type="submit">Sign in with GitHub</button>
        </form>
    )
}
