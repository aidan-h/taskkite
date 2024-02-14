"use client";
import { SyncState } from "../_lib/sync";
import { syncStateText } from "../_lib/syncSlice";
import SecondaryButton from "./SecondaryButton";

export default function SyncStatus({
	status,
}: {
	status: SyncState;
}) {
	if (status == SyncState.SYNCING)
		return (
			<div className="absolute left-0 bottom-0 m-4">
				<div>Syncing</div>
			</div>
		);
	return (
		<div className="absolute left-0 bottom-0 m-4">
			<SecondaryButton onClick={() => console.log("sync")}>{syncStateText(status)}</SecondaryButton>
		</div>
	);
}
