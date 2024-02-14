"use client"
import { BuiltInProviderType } from "next-auth/providers/index";
import { LiteralUnion, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export interface Provider {
	name: string,
	id: LiteralUnion<BuiltInProviderType, string>,
}

export default function ClientLandingPage({ providers }: { providers: Provider[] }) {
	const { data: session } = useSession();
	const router = useRouter();
	if (session && session.user) {
		router.push("/app");
	}

	return (
		<>
			<h1>To-Do App</h1>
			{providers.map((provider) =>
				<button key={provider.name} onClick={() => signIn(provider.id)}>Sign in with {provider.name}</button>
			)}
		</>
	);

}

