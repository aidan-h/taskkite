import { ReactNode } from "react";

export default function BottomRightContainer({ children }: { children: ReactNode }) {
	return <div className="absolute flex gap-3 right-4 bottom-4">
		{children}
	</div>
}
