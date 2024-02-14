import { ReactNode } from "react";

export function CenterContainer({ children }: { children: ReactNode }) {
	return <div className="max-w-full mx-12 sm:max-w-lg mt-24 sm:mx-auto">{children}</div>;
}
