"use client";
import Image from "next/image";
import { BuiltInProviderType } from "next-auth/providers/index";
import { LiteralUnion, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import Hero from "./Hero";
import Descriptor from "./Descriptor";
import PrivacyPolicy from "./PrivacyPolicy";

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
			className="max-w-96 mx-auto font-semibold block bg-slate-50 text-zinc-900 shadow rounded p-4"
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

function Features() {
	const features = [
		"✔ Synchronization Across Sessions",
		"✔ Available Offline",
		"✔ Projects",
		"✔ Due Dates and Times",
		"✔ Task Labels",
		"🚧 Shared Projects",
		"🚧 File and Image Attachments",
		"🚧 Desktop and Android App",
		"🚧 Repeating Tasks",
		"🚧 Sub-Tasks",
	];

	return <div className="w-60 mx-auto mt-5">
		<ul className="text-center text-3xl font-bold">Features</ul>
		{features.map((feature, i) => <li className="text-left text-sm font-semibold" key={i}>{feature}</li>)}</div>
}

function N({ children }: { children: ReactNode }) {
	return <div className="w-60 sm:w-72 mx-auto text-center mt-24">
		<Image
			src="/logo.png"
			className="dark:invert mx-auto mb-8"
			width={120}
			height={120}
			alt="Taskkite logo"
		/>
		<h1 className="text-6xl mb-5 font-serif w-full text-center">Taskkite</h1>
		<h1 className="text-xl mb-4 font-thin">Organize your life, work, and home for good.</h1>
		<a target="_blank" href="https://codeberg.org/aidanhammond/taskkite" className="text-md font-serif font-light">Taskkite is open source and completely free!</a>
		<div className="mb-8" />
		{children}
		<PrivacyPolicy />
		<Features />
	</div>
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
			<N>
				<Descriptor>Failed to login, please try again.</Descriptor>
				<Providers providers={providers} setState={setState} />
			</N>
		);
	if (state == LoginState.Succeeded)
		return (
			<N>
				<Descriptor>Redirecting you to your projects!</Descriptor>
			</N>
		);

	return (
		<N>
			<Providers providers={providers} setState={setState} />
		</N>
	);
}
