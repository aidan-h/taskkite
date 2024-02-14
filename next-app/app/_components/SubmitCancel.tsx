import BottomRightContainer from "./BottomRightContainer";

export default function SubmitCancel({
	submitText,
	cancel,
	submit
}: {
	cancel: () => void;
	submit?: () => void;
	submitText: string;
}) {
	return (
		<BottomRightContainer>
			<button className="px-2 rounded shadow" onClick={cancel}>
				Cancel
			</button>
			<button
				className="bg-indigo-500 px-2 rounded shadow text-zinc-50"
				type="submit"
				onClick={submit}
			>
				{submitText}
			</button>
		</BottomRightContainer>
	);
}
