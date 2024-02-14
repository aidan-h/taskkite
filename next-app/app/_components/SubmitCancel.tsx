import BottomRightContainer from "./BottomRightContainer"

export default function SubmitCancel({ isSubmitting, submitText, cancel }: {
	isSubmitting: boolean, cancel: () => void; submitText: string
}) {
	return <BottomRightContainer>
		<button className="px-2 mx-3 rounded shadow" onClick={cancel}>Cancel</button>
		<button className="bg-slate-500 px-2 rounded shadow text-slate-100" type="submit" disabled={isSubmitting}>
			{submitText}
		</button>
	</BottomRightContainer >
}
