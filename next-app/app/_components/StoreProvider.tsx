"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { AppStore, createStore } from "../_lib/store";
import { AccountSettings, AppData } from "../_lib/schemas";

export default function StoreProvider({
	children,
	appData,
}: {
	children: React.ReactNode;
	appData: AppData;
}) {
	const storeRef = useRef<AppStore>();
	if (!storeRef.current) {
		// Create the store instance the first time this renders
		storeRef.current = createStore(appData);
	}

	return <Provider store={storeRef.current}>{children}</Provider>;
}
