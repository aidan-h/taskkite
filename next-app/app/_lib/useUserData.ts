import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { createContext, useEffect, useState } from "react";

export interface UserData {
	email: string,
	name: string
}

export const UserDataContext = createContext<[UserData, () => undefined]>([{ email: "null", name: "null" }, () => { }]);

let t = 0
function getUserData<T>(callback: (data: UserData) => T, router: AppRouterInstance) {
	t += 1
	let c = t
	fetch("/api/user/get", { method: "POST" }).then((data) => data.json().then((data) => callback(data as UserData))).catch(() => { if (t == c) router.push("/") })
}

export default function useUserData(router: AppRouterInstance): [UserData | undefined, () => undefined] {
	const [userData, setUserData] = useState<UserData | undefined>(undefined);
	useEffect(() => getUserData(setUserData, router), [router])
	return [userData, () => { getUserData(setUserData, router) }];
}
