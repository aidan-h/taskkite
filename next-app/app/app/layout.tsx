"use client";
import useClientData, { AppDataContext } from "../_lib/useUserData";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const clientData = useClientData();
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
