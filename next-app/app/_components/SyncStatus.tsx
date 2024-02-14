"use client";
import { useContext } from "react";
import { SyncStatus as Status, syncStatusText } from "../_lib/sync";
import SecondaryButton from "./SecondaryButton";
import { ProjectContext } from "../_lib/ProjectContext";

export default function SyncStatus() {
	const { sync, status } = useContext(ProjectContext);
	if (status == Status.PENDING)
		return <div className="absolute left-0 bottom-0 m-4">
			<div>Syncing</div>
		</div>
	return <div className="absolute left-0 bottom-0 m-4">
		<SecondaryButton onClick={sync}>{syncStatusText(status)}</SecondaryButton>
	</div>
}
