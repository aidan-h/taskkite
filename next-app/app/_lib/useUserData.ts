import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { createContext, useEffect, useState } from "react";
import { AppData } from "./api";

export enum SyncState {
  PENDING,
  SYNCED,
  FAILED,
}

export interface ClientData {
  state: SyncState;
  data: AppData;
}

export const UserDataContext = createContext<[ClientData, () => void]>([
  {
    email: "null",
    name: "null",
    projects: [],
  },
  () => {},
]);

export default function useUserData(
  router: AppRouterInstance,
): [AppData | undefined, () => undefined] {
  const [userData, setUserData] = useState<AppData | undefined>(undefined);
  useEffect(() => getUserData(setUserData, router), [router]);
  return [
    userData,
    () => {
      getUserData(setUserData, router);
    },
  ];
}
