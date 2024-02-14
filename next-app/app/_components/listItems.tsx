import { ReactNode, useState } from "react";
import SubmitCancel from "./SubmitCancel";

export function ListItem({ children }: { children: ReactNode }) {
	return <div
		className="text-center relative text-lg p-4 rounded shadow visible bg-slate-100 w-full block mb-4"
	>
		{children}
	</div>
}
export function ListItemButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
	return <button
		className="text-center relative text-lg p-4 rounded shadow hover:shadow-lg transition visible bg-slate-100 w-full block mb-4"
		onClick={onClick}
	>
		{children}
	</button>

}
export function SecondaryListItemButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
	return (
		<button
			className="transition hover:shadow-lg text-center text-lg rounded shadow p-4 bg-slate-200 w-full block mb-4"
			onClick={onClick}
		>
			{children}
		</button>)
}

export function DeleteListItem({ action, text, confirmText }: { confirmText: string; text: string; action: () => void }) {
	const [del, setDel] = useState(false);
	if (!del)
		return <SecondaryListItemButton onClick={() => setDel(true)}>{text}</SecondaryListItemButton>
	return <ListItem>
		<p className="text-left mb-6">{confirmText}</p>
		<SubmitCancel submitText="Delete" submit={action} cancel={() => setDel(false)} />
	</ListItem>
}

