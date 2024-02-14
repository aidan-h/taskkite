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
  const { data: session } = useSession();
  const clientData = useClientData();
  const router = useRouter();

  useEffect(() => {
    if (session === null) {
      router.push("/");
    }
  }, [session, router]);

  if (session === null) return <Message>Redirecting to login...</Message>;

  if (session === undefined) return <Message>Loading session</Message>;

  if (clientData.state.data) {
    return (
      <AppDataContext.Provider
        value={{
          data: clientData.state.data,
          update: clientData.fetch,
        }}
      >
        <NavigationPanel appData={clientData.state.data} />
        {children}
      </AppDataContext.Provider>
    );
  }
  return <Message>Loading user data...</Message>;
}
