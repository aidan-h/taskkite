import BottomRightContainer from "./BottomRightContainer";

export default function SubmitCancel({
	submitText,
	submit,
	cancel,
}: {
	submit: () => void;
	cancel: () => void;
	submitText: string;
}) {
	return (
		<BottomRightContainer>
			<button className="px-2 rounded shadow" onClick={cancel}>
				Cancel
			</button>
			<button
				className="bg-indigo-500 px-2 rounded shadow text-zinc-50"
				onClick={submit}
				type="submit"
			>
				{submitText}
			</button>
		</BottomRightContainer>
	);
}
