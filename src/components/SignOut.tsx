"use client"
import { signOutWithGithub } from "@/../actions"

export default function SignOutButton() {
    return (
        <form action={signOutWithGithub}>
            <button type="submit" >
                Sign Out
            </button>
        </form>
    )
}