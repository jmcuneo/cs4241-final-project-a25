"use client"
import { signOutAction } from "@/../actions"

export default function SignOutButton() {
    return (
        <form action={signOutAction}>
            <button type="submit">
                Sign Out
            </button>
        </form>
    )
}