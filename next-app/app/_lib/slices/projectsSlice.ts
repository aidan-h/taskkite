import {
	Project,
	ProjectEvents,
} from "../schemas";
import { ArrayPush, ArraySync, syncArraySlice } from "../syncSlice";
import { clientProjectEventHandlers } from "../clientProjectEventHandlers";
import { SyncData, Event, createSyncData } from "../sync";
import { createProjectFetch, syncProjectFetch } from "../api";
import { ReducerCreators } from "@reduxjs/toolkit";

function createReducers(
	create: ReducerCreators<SyncData<Project, ProjectEvents>[]>,
	sync: ArraySync<Project, ProjectEvents>,
	push: ArrayPush<Project, ProjectEvents>,
) {
	return {
		createProject: create.asyncThunk(async (name: string, _) => {
			return await createProjectFetch(name)
		}, {
			fulfilled: (state, action) => {
				state.push(
					createSyncData({
						client: {
							data: action.payload,
							historyCount: 0
						}
					})

				);

			}
		}),
		syncProject: sync,
		pushEvent: push,
	}
}
export const projectsSlice = syncArraySlice<Project, ProjectEvents, "projects", ReturnType<typeof createReducers>>("projects",
	[],
	(syncData, events) => syncProjectFetch({
		projectId: syncData.client.data.id,
		index: syncData.shadow.historyCount,
		changes: events,
	}),
	clientProjectEventHandlers,
	(rootState) => (rootState as any).projects as SyncData<Project, ProjectEvents>[],
	createReducers
);


export const { pushEvent, syncProject, createProject } = projectsSlice.actions;

export function pushProjectEvent(event: Event<ProjectEvents>, projects: SyncData<Project, ProjectEvents>[]) {
	const index = projects.findIndex((project) => project.client.data.id == event[1].projectId);
	return pushEvent({ event, index })
}
