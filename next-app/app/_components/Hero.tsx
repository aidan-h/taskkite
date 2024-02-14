import Image from "next/image";
import { ReactNode } from "react";

export default function Hero({ children }: { children: ReactNode }) {
	return (
		<div className="mx-8 sm:mx-auto max-w-2xl mt-24">
			<Image src="/logo.png" className="mx-auto mb-8" width={120} height={120} alt="Taskkite logo" />
			<h1 className="font-serif w-full text-center mb-8 text-2xl sm:text-5xl">Taskkite</h1>
			{children}
		</div >
	);
}
