"use client";
import { useSession } from "next-auth/react";
import { AppDataContext, ProjectSync, createProjectSync } from "../_lib/useUserData";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import Descriptor from "../_components/Descriptor";
import Hero from "../_components/Hero";
import NavigationPanel from "../_components/NavigationPanel";
import { Shadow, SyncState, SyncStatus, createSyncFetch, useSyncClient } from "../_lib/sync";
import { getAppData, getProject } from "../_lib/api";
import { AppData, ClientEvent, Project } from "../_lib/data";

function Message({ children }: { children: ReactNode }) {
	return (
		<Hero>
			<Descriptor>{children}</Descriptor>
		</Hero>
	);
}

function useProjectsData(appData: AppData | undefined): ProjectSync[] {
	//TODO not sure if a 2-step useState is efficient here
	const [projects, setProjects] = useState([] as {
		id: number;
		status: SyncStatus;
		data: Project | undefined;
		shadow: Shadow<Project, ClientEvent> | undefined;
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
				status: SyncStatus.FAILED,
				data: undefined,
				shadow: undefined,
			}
		}));
	}, [appData])

	useEffect(() =>
		setSyncs(projects.map((p) => {
			const setSyncState = (newState: SyncState<Project>) => setProjects(projects.map((project) => {
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
			if (p.status == SyncStatus.FAILED)
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

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const d = useSession();
	let data = null
	if (d) data = d.data
	const clientData = useSyncClient(getAppData);
	const router = useRouter();
	const appData = clientData.state.data;
	const projectsData = useProjectsData(appData);

	useEffect(() => {
		if (data === null) {
			router.push("/");
		}
	}, [data, router]);

	if (data === null) return <Message>Redirecting to login...</Message>;

	if (data === undefined) return <Message>Loading session</Message>;

	if (appData) {
		return (
			<AppDataContext.Provider
				value={{
					projects: projectsData,
					data: appData,
					update: clientData.fetch,
				}}
			>
				<div className="sm:ml-40">
					{children}
				</div>
				<NavigationPanel appData={clientData.state.data} />
			</AppDataContext.Provider>
		);
	}
	return <Message>Loading user data...</Message>;
}
