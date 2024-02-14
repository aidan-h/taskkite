"use client";
import { BuiltInProviderType } from "next-auth/providers/index";
import { LiteralUnion, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Hero from "./Hero";
import Descriptor from "./Descriptor";

export interface Provider {
  name: string;
  id: LiteralUnion<BuiltInProviderType, string>;
}

enum LoginState {
  None,
  Pending,
  Succeeded,
  Failed,
}

function Providers({
  providers,
  setState,
}: {
  providers: Provider[];
  setState: (state: LoginState) => void;
}) {
  return providers.map((provider) => (
    <button
      className="mx-auto w-96 block bg-slate-300 p-4"
      key={provider.name}
      onClick={() => {
        setState(LoginState.Pending);
        signIn(provider.id).catch((err) => {
          console.error(err);
          setState(LoginState.Failed);
        });
      }}
    >
      Sign in with {provider.name}
    </button>
  ));
}

export default function ClientLandingPage({
  providers,
}: {
  providers: Provider[];
}) {
  const { data: session } = useSession();
  const [state, setState] = useState(
    session ? LoginState.Succeeded : LoginState.None,
  );
  const router = useRouter();

  useEffect(() => {
    if (session) {
      setState(LoginState.Succeeded);
      router.push("/app");
    }
  }, [session, router]);

  if (state == LoginState.Pending)
    return (
      <Hero>
        <Descriptor>Logging you in...</Descriptor>
      </Hero>
    );
  if (state == LoginState.Failed)
    return (
      <Hero>
        <Descriptor>Failed to login, please try again.</Descriptor>
        <Providers providers={providers} setState={setState} />
      </Hero>
    );
  if (state == LoginState.Succeeded)
    return (
      <Hero>
        <Descriptor>Redirecting you to your projects!</Descriptor>
      </Hero>
    );

  return (
    <Hero>
      <Providers providers={providers} setState={setState} />
    </Hero>
  );
}
