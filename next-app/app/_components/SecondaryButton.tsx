import { ReactNode } from "react";

export default function SecondaryButton({ children, onClick }: { children: ReactNode, onClick: () => void }) {
	return <button
		className="text-sm mr-1 px-1 bg-indigo-500 text-zinc-50 rounded"
		onClick={onClick}
	>
		{children}
	</button>
}
