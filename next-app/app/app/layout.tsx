"use client";
import { useSession } from "next-auth/react";
import useClientData, { AppDataContext } from "../_lib/useUserData";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const { data: session } = useSession();
	const clientData = useClientData();
	const router = useRouter();

	useEffect(() => {
		if (session === null) {
			router.push("/");
		}
	}, [session, router])

	if (session === null)
		return <p>Redirecting to login...</p>;

	if (session === undefined)
		return <p>Loading session</p>;

	if (clientData.state.data) {
		return (
			<AppDataContext.Provider
				value={{
					data: clientData.state.data,
					update: clientData.fetch
				}}
			>
				{children}
			</AppDataContext.Provider>
		);
	}
	return <p>Loading user data...</p>;
}
