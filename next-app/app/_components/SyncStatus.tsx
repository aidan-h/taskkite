"use client";
import { SyncState } from "../_lib/sync";
import useProjects from "../_lib/useProjects";

function N({ syncState, name }: { syncState: SyncState, name: string }) {
	return <div>
		syncing {name} {syncState == SyncState.FAILED ? "failed" : ""}
	</div>
}

export default function SyncStatus() {
	const projects = useProjects();
	return <div className="absolute right-0 bottom-0">
		{projects.filter((project) => project.state != SyncState.SYNCED).map((project) =>
			<N key={project.client.data.id} name={project.client.data.name} syncState={project.state} />)}
	</div>
}

