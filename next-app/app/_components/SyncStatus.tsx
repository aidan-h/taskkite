"use client";
import { SyncState } from "../_lib/sync";
import useProjects from "../_lib/useProjects";

function N({ syncState, name }: { syncState: SyncState, name: string }) {
	return <div>
		{name} {syncState == SyncState.FAILED ? "failed to update" : syncState == SyncState.SYNCING ? "is updating" : "updated"}
	</div>
}

export default function SyncStatus() {
	const projects = useProjects();
	const status = projects.filter((project) => project.state != SyncState.SYNCED).map((project) =>
		<N key={project.client.data.id} name={project.client.data.name} syncState={project.state} />)
	if (status.length == 0) return <></>
	return <div className="absolute bg-indigo-500 m-5 p-2 rounded text-zinc-50 right-0 bottom-0">
		{status}
	</div>
}

