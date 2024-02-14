import { ReactNode, useState } from "react";
import SubmitCancel from "./SubmitCancel";

export function ListItem({ onClick, children }: { onClick?: () => void, children: ReactNode }) {
	return (
		<div onClick={onClick} className="cursor-pointer text-wrap text-center relative text-md p-4 rounded shadow visible bg-zinc-100 dark:bg-zinc-600 w-full block mb-2">
			{children}
		</div>
	);
}
export function ListItemButton({
	children,
	onClick,
}: {
	children: ReactNode;
	onClick: () => void;
}) {
	return (
		<button
			className="text-wrap text-center relative text-md p-4 rounded shadow hover:shadow-lg transition visible bg-zinc-100 dark:bg-zinc-600 w-full block mb-2"
			onClick={onClick}
		>
			{children}
		</button>
	);
}

export function SecondaryListItem({ children, onClick }: { onClick?: () => void, children: ReactNode }) {
	return (
		<div onClick={onClick} className="text-wrap cursor-pointer relative text-center text-md rounded shadow p-4 bg-zinc-200 dark:bg-zinc-700 w-full block mb-2">
			{children}
		</div>
	);
}

export function SecondaryListItemButton({
	children,
	onClick,
}: {
	children: ReactNode;
	onClick: () => void;
}) {
	return (
		<button
			className="text-wrap transition hover:shadow-lg text-center text-md rounded shadow p-4 bg-zinc-200 dark:bg-zinc-700 w-full block mb-2"
			onClick={onClick}
		>
			{children}
		</button>
	);
}

export function DeleteListItem({
	action,
	text,
	confirmText,
}: {
	confirmText: string;
	text: string;
	action: () => void;
}) {
	const [del, setDel] = useState(false);
	if (!del)
		return (
			<SecondaryListItemButton onClick={() => setDel(true)}>
				{text}
			</SecondaryListItemButton>
		);
	return (
		<ListItem>
			<p className="text-left mb-6">{confirmText}</p>
			<SubmitCancel
				submitText="Delete"
				submit={action}
				cancel={() => setDel(false)}
			/>
		</ListItem>
	);
}
