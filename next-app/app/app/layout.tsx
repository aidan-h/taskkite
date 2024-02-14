'use client'
import { useRouter } from "next/navigation";
import useUserData, { UserData, UserDataContext } from "../_lib/useUserData"

export default function AppLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const userData = useUserData(useRouter());
	if (userData[0]) {
		return <UserDataContext.Provider value={userData as [UserData, () => undefined]}>{children}</UserDataContext.Provider>
	}
	return <p>Loading user data...</p>
}
