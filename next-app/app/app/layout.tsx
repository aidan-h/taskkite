"use client";
import { useRouter } from "next/navigation";
import useClientData, { ClientData, AppDataContext } from "../_lib/useUserData";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const userData = useClientData(useRouter());
  if (userData[0]) {
    return (
      <AppDataContext.Provider
        value={userData as [ClientData, () => undefined]}
      >
        {children}
      </AppDataContext.Provider>
    );
  }
  return <p>Loading user data...</p>;
}
