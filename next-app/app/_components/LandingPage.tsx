"use client"
import { BuiltInProviderType } from "next-auth/providers/index";
import { LiteralUnion, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export interface Provider {
	name: string,
	id: LiteralUnion<BuiltInProviderType, string>,
}

function Hero({ children }: { children: ReactNode }) {
	return (
		<div className="mx-auto p-12 max-w-2xl bg-slate-50 mt-24">
			<h1 className="w-full text-center text-5xl mb-8">Taskkite</h1>
			{children}
		</div>
	);
}

enum LoginState {
	None,
	Pending,
	Succeeded,
	Failed,
}

function Providers({ providers, setState }: { providers: Provider[], setState: (state: LoginState) => void }) {
	return providers.map((provider) =>
		<button className="mx-auto w-96 block bg-slate-300 p-4" key={provider.name} onClick={
			() => {
				setState(LoginState.Pending)
				signIn(provider.id).then((v) =>
					setState(v ? v.ok ? LoginState.Succeeded : LoginState.Failed : LoginState.Succeeded)
				).catch((err) => { console.error(err); setState(LoginState.Failed) })
			}}>Sign in with {provider.name}</button>
	)
}

function Descriptor({ children }: { children: ReactNode }) {
	return <p className="my-12 w-full text-center block">{children}</p>
}

export default function ClientLandingPage({ providers }: { providers: Provider[] }) {
	const { data: session } = useSession();
	const [state, setState] = useState(LoginState.None)
	const router = useRouter();

	useEffect(() => {
		if (session && session.user) {
			setState(LoginState.Succeeded)
			router.push("/app");
		}
	}, [session, router])

	if (state == LoginState.Pending)
		return <Hero>
			<Descriptor>Logging you in...</Descriptor>
		</Hero>
	if (state == LoginState.Failed)
		return <Hero>
			<Descriptor>Failed to login, please try again.</Descriptor>
			<Providers providers={providers} setState={setState} />
		</Hero>
	if (state == LoginState.Succeeded)
		return <Hero>
			<Descriptor>Redirecting you to your projects!</Descriptor>
		</Hero>

	return <Hero>
		<Providers providers={providers} setState={setState} />
	</Hero>

}

