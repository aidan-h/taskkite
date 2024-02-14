import {
	ProjectData,
	ProjectEvents,
	ProjectIdentifier,
} from "../schemas";
import { syncArraySlice } from "../syncSlice";
import { clientProjectEventHandlers } from "../clientProjectEventHandlers";
import { SyncData } from "../sync";
import { syncProject } from "../api";

export enum SyncState {
	SYNCING,
	SYNCED,
	FAILED,
}

type Project = ProjectData & ProjectIdentifier;

export const projectsSlice = syncArraySlice<Project, ProjectEvents>("projects",
	[],
	(syncData, events) => syncProject({
		projectId: syncData.data.id,
		index: syncData.historyCount,
		changes: events,
	}),
	clientProjectEventHandlers,
	(rootState) => (rootState as any).projects as SyncData<Project, ProjectEvents>[]);


export const {
	pushEvent, sync
} = projectsSlice.actions;
