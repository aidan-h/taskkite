import {
	Project,
	ProjectEvents,
} from "../schemas";
import { ArrayPush, ArraySync, syncArraySlice } from "../syncSlice";
import { clientProjectEventHandlers } from "../clientProjectEventHandlers";
import { SyncData, Event, createSyncData, InitialState } from "../sync";
import { syncProjectFetch } from "../api";
import { Draft, PayloadAction, ReducerCreators } from "@reduxjs/toolkit";

function n(
	create: ReducerCreators<SyncData<Project, ProjectEvents>[]>,
	sync: ArraySync<Project, ProjectEvents>,
	push: ArrayPush<Project, ProjectEvents>,
) {
	return {
		createProject: create.reducer((syncs, action: PayloadAction<InitialState<Project>>) => {
			syncs.push(createSyncData(action.payload) as Draft<SyncData<Project, ProjectEvents>>)
		}),
		syncProject: sync,
		pushEvent: push,
	}
}
export const projectsSlice = syncArraySlice<Project, ProjectEvents, "projects", ReturnType<typeof n>>("projects",
	[],
	(syncData, events) => syncProjectFetch({
		projectId: syncData.client.data.id,
		index: syncData.client.historyCount,
		changes: events,
	}),
	clientProjectEventHandlers,
	(rootState) => (rootState as any).projects as SyncData<Project, ProjectEvents>[],
	n
);


export const { pushEvent, syncProject, createProject } = projectsSlice.actions;

export function pushProjectEvent(event: Event<ProjectEvents>, projects: SyncData<Project, ProjectEvents>[]) {
	const index = projects.findIndex((project) => project.client.data.id == event[1].projectId);
	return pushEvent({ event, index })
}
