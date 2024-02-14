import { useEffect, useState } from "react";
import { Shadow, SyncState, SyncStatus, createSyncFetch } from "../_lib/sync";
import { getProject } from "../_lib/api";
import { AppData, ClientEvent, ProjectData } from "../_lib/data";
import { ProjectSync, createProjectSync } from "../_lib/projectSync";


export default function useProjectsData(appData: AppData | undefined): ProjectSync[] {
	//TODO not sure if a 2-step useState is efficient here
	const [projects, setProjects] = useState([] as {
		id: number;
		status: SyncStatus;
		data: ProjectData | undefined;
		shadow: Shadow<ProjectData, ClientEvent> | undefined;
	}[]);
	const [syncs, setSyncs] = useState([] as ProjectSync[])

	useEffect(() => {
		if (!appData) {
			setProjects([])
			return;
		}
		setProjects(appData.projects.map((projectIdentifier) => {
			return {
				id: projectIdentifier.id,
				status: SyncStatus.WAITING,
				data: undefined,
				shadow: undefined,
			}
		}));
	}, [appData])

	useEffect(() =>
		setSyncs(projects.map((p) => {
			const setSyncState = (newState: SyncState<ProjectData>) => setProjects(projects.map((project) => {
				if (project.id != p.id)
					return project
				return {
					...project,
					status: newState.status,
					data: newState.data,
				}
			}));
			const syncState = {
				status: p.status,
				data: p.data,
			};
			const fetch = createSyncFetch(syncState, setSyncState, () => getProject({ projectId: p.id }));
			if (p.status == SyncStatus.WAITING)
				fetch()

			return createProjectSync({
				id: p.id,
				setState: setSyncState,
				state: syncState,
				fetch: fetch,
				shadow: p.shadow,
				setShadow: (shadow) => setProjects(projects.map((project) => {
					if (project.id != p.id)
						return project
					return {
						...project,
						shadow: shadow
					}

				}))

			})
		}))
		, [projects]);

	return syncs
}

