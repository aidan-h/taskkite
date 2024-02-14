import { getProviders } from "next-auth/react";
import ClientLandingPage from "./_components/LandingPage";

export default async function Component() {
  const p = await getProviders();

  const providers = Object.values(p ?? []).map((provider) => {
    return { name: provider.name, id: provider.id };
  });

  return <ClientLandingPage providers={providers} />;
}
