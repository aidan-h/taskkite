"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import Descriptor from "../_components/Descriptor";
import Hero from "../_components/Hero";
import NavigationPanel from "../_components/NavigationPanel";
import { Session } from "next-auth";
import { AppStore, createStore } from "../_lib/store";
import { Provider } from "react-redux";
import { getAppData } from "../_lib/api";
import SyncStatus from "../_components/SyncStatus";

function Message({ children }: { children: ReactNode }) {
	return (
		<Hero>
			<Descriptor>{children}</Descriptor>
		</Hero>
	);
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const d = useSession();
	const [store, setStore] = useState(undefined as AppStore | undefined);
	let data: Session | null | undefined = null;
	if (d) data = d.data;
	const router = useRouter();

	useEffect(() => {
		if (data && !store) {
			getAppData()
				.then((appData) => setStore(createStore(appData)))
				.catch(console.error);
		}
	}, [store, data]);

	useEffect(() => {
		if (data === null) {
			router.push("/");
		}
	}, [data, router]);

	if (data === null) return <Message>Redirecting to login...</Message>;

	if (data === undefined) return <Message>Loading session</Message>;

	if (store) {
		return (
			<Provider store={store}>
				<div className="sm:ml-40">{children}</div>
				<NavigationPanel />
				<SyncStatus />
			</Provider>
		);
	}
	return <Message>Loading user data...</Message>;
}
