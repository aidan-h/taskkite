import { CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import {
	AddLabelEvent,
	CreateTaskEvent,
	DeleteLabelEvent,
	DeleteTaskEvent,
	EditTaskEvent,
	ProjectData,
	ProjectIdentifier,
	Task,
} from "../data";
import createAppSlice from "../createAppSlice";
import { createProject } from "../api";
import { RootState } from "../store";

export enum SyncState {
	SYNCING,
	SYNCED,
	FAILED,
}

export type Project = ProjectIdentifier & {
	data: ProjectData;
};

export type ClientProject = ProjectIdentifier & {
	client: ProjectData;
	syncState: SyncState;
	shadow?: ProjectData;
};

export type ProjectSliceData = {
	projects: ClientProject[];
	projectCount: number;
};

type ProjectAction = PayloadAction<{ projectId: number }>;
type TaskAction = PayloadAction<{ projectId: number; id: number }>;
function alterProject(
	projects: Project[],
	action: ProjectAction,
	reducer: (data: ProjectData) => void,
) {
	const project = projects.find(
		(project) => project.id == action.payload.projectId,
	);
	if (project && project.data) reducer(project.data);
}

function alterProjectTask(
	projects: Project[],
	action: TaskAction,
	reducer: (task: Task) => void,
) {
	alterProject(projects, action, (data) => {
		const task = data.tasks.find((task) => task.id == action.payload.id);
		if (task) reducer(task);
	});
}

function newProjectData(name: string): ProjectData {
	return {
		tasks: [],
		historyCount: 0,
		taskCount: 0,
		name,
	};
}

function findProject(id: number, projects: ClientProject[]) {
	return projects.find((project) => project.id == id);
}
type FulfilledReducer<Args> = CaseReducer<ProjectSliceData, PayloadAction<any, string, {
	arg: Args;
	requestId: string;
	requestStatus: "fulfilled";
}, never>>

function fulfilled<T extends { id: number }>(projectData: (payload: T) => ProjectData): FulfilledReducer<T> {
	return (state, action) => {
		const project = findProject(action.meta.arg.id, state.projects);
		if (!project) return;
		project.shadow = projectData(action.meta.arg)
		project.syncState = SyncState.SYNCED;
	}
}

const rejected = (state: ProjectSliceData, action: PayloadAction<any, any, {
	arg: { id: number }
}, never>) => {
	const project = findProject(action.meta.arg.id, state.projects);
	if (!project) return;
	project.syncState = SyncState.FAILED;
}

export const newProjectsSlice = createAppSlice({
	name: "accountSettings",
	initialState: { projects: [], projectCount: 0 } as ProjectSliceData,
	reducers: (create) => {
		return {
			createProject: create.asyncThunk(
				async (
					{ name }: { owner: string; id: number; name: string },
					_,
				) => {
					return await createProject(name);
				},
				{
					pending: (state, action) => {
						state.projects.push({
							client: newProjectData(action.meta.arg.name),
							syncState: SyncState.SYNCING,
							owner: action.meta.arg.owner,
							id: action.meta.arg.id,
						});
					},
					fulfilled: fulfilled((payload) => newProjectData(payload.name)),
					rejected: rejected,
				},
			),
			sync: create.asyncThunk(
				async (
					{ id }: { id: number },
					thunkApi,
				) => {
					const appState = thunkApi.getState() as RootState;
					const project = findProject(id, appState.projects.projects);
					if (!project) return;
					return await createProject(project.client.name);
				},
				{
					pending: (state, action) => {
						const project = findProject(action.meta.arg.id, state.projects);
						if (!project) return;
						project.syncState = SyncState.SYNCING;
					},
					fulfilled: fulfilled((payload) => newProjectData(payload.name)),
					rejected: rejected,
				}
			)
		};
	},
});

export const projectsSlice = createAppSlice({
	name: "accountSettings",
	initialState: [] as Project[],
	reducers: (create) => {
		return {
			addProject: (state, action: PayloadAction<Project>) => {
				const index = state.findIndex(
					(project) => project.id == action.payload.id,
				);
				if (index) {
					state[index] = action.payload;
					return;
				}
				state.push(action.payload);
			},
			deleteProject: (state, action: PayloadAction<number>) =>
				state.filter((project) => project.id != action.payload),
			clearProjects: () => [],
			createTask: (state, action: PayloadAction<CreateTaskEvent>) => {
				alterProject(state, action, (data) => {
					data.tasks.push({
						archived: false,
						completed: false,
						id: data.taskCount,
						name: action.payload.name,
						description: action.payload.description,
					});
					data.taskCount++;
				});
			},
			editTask: (state, action: PayloadAction<EditTaskEvent>) => {
				const payload = action.payload;
				alterProjectTask(state, action, (task) => {
					const fields: (keyof typeof payload & keyof typeof task)[] = [
						"name",
						"description",
						"completed",
						"archived",
						"dueDate",
						"dueTime",
					];
					fields.forEach((field) => {
						//@ts-ignore
						task[field] = payload[field];
					});
				});
			},
			deleteTask: (state, action: PayloadAction<DeleteTaskEvent>) => {
				alterProject(state, action, (data) =>
					data.tasks.filter((task) => task.id != action.payload.id),
				);
			},
			deleteLabel: (state, action: PayloadAction<DeleteLabelEvent>) =>
				alterProjectTask(state, action, (task) =>
					task.labels?.filter((label) => label != action.payload.name),
				),
			addLabel: (state, action: PayloadAction<AddLabelEvent>) =>
				alterProjectTask(state, action, (task) => {
					if (!task.labels) {
						task.labels = [action.payload.name];
						return;
					}
					if (
						task.labels.find((label) => label == action.payload.name) ==
						undefined
					)
						task.labels.push(action.payload.name);
				}),
		};
	},
});

export const {
	addProject,
	deleteProject,
	clearProjects: clear,
	createTask,
	editTask,
	deleteLabel,
	addLabel,
} = projectsSlice.actions;
