import { createContext, useEffect, useState } from "react";

export interface UserData {
	email: string,
	name: string
}

export const UserDataContext = createContext<[UserData, () => undefined]>([{ email: "null", name: "null" }, () => { }]);

function getUserData<T>(callback: (data: UserData) => T) {
	fetch("/api/user/get").then((data) => data.json().then((data) => callback(data as UserData)))
}

export default function useUserData(): [UserData | undefined, () => undefined] {
	const [userData, setUserData] = useState<UserData | undefined>(undefined);
	useEffect(() => getUserData(setUserData), [])
	return [userData, () => { getUserData(setUserData) }];
}
