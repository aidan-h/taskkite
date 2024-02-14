"use client";
import { useSession } from "next-auth/react";
import useClientData, { AppDataContext } from "../_lib/useUserData";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import Descriptor from "../_components/Descriptor";
import Hero from "../_components/Hero";
import NavigationPanel from "../_components/NavigationPanel";

function Message({ children }: { children: ReactNode }) {
	return (
		<Hero>
			<Descriptor>{children}</Descriptor>
		</Hero>
	);
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const d = useSession();
	let data = null
	if (d) data = d.data
	const clientData = useClientData();
	const router = useRouter();

	useEffect(() => {
		if (data === null) {
			router.push("/");
		}
	}, [data, router]);

	if (data === null) return <Message>Redirecting to login...</Message>;

	if (data === undefined) return <Message>Loading session</Message>;

	if (clientData.state.data) {
		return (
			<AppDataContext.Provider
				value={{
					data: clientData.state.data,
					update: clientData.fetch,
				}}
			>
				<div className="sm:ml-40">
					{children}
				</div>
				<NavigationPanel appData={clientData.state.data} />
			</AppDataContext.Provider>
		);
	}
	return <Message>Loading user data...</Message>;
}
