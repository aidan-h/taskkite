'use client'
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Account() {
	const { data: session } = useSession()
	const router = useRouter()
	if (session === null) {
		router.push("/")
	} else if (session === undefined) {
		return <p>Loading user</p>
	}

	return <>
		<h1>Account Settings</h1>
		<button onClick={() => signOut()}>Sign Out</button>
		<button onClick={() => router.push("/home")}>Back</button>
	</>
}
