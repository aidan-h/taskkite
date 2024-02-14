
export default function SecondaryButton({ children, onClick }: { children: ReactNode, onClick: () => void }) {
	return <button
		className="text-sm mr-1 px-1 bg-slate-500 text-slate-50 rounded"
		onClick={onClick}
	>
		{children}
	</button>
}
