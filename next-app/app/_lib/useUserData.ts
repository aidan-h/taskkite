import { createContext } from "react";
import { getAppData, getProject, syncProject } from "./api";
import {
	AddLabelEvent,
	AppData,
	ClientEvent,
	CreateTaskEvent,
	DeleteLabelEvent,
	DeleteTaskEvent,
	EditTaskEvent,
	Project,
	Task,
} from "./data";
import {
	IncrementalData as IncrementalSync,
	SyncClient,
	SyncStatus,
	useIncrementalData,
	useSyncClient,
} from "./sync";

export const SyncStateContext = createContext<SyncStatus>(SyncStatus.PENDING);

export type ProjectClientData = SyncClient<Project> & {
	emitEvent: (event: ClientEvent) => void;
};

export type ClientData = SyncClient<AppData>;
export const AppDataContext = createContext<{
	data: AppData;
	update: () => void;
}>({
	data: {
		email: "test@test.com",
		name: "name",
		projects: [],
	},
	update: () => { },
});

function editTasks(project: Project, id: number, action: (task: Task) => Task): Task[] {
	const index = project.tasks.findIndex((task) => task.id == id);
	if (index == -1) {
		console.error("couldn't apply event to unfound task", event, project);
		return project.tasks;
	}
	let tasks = project.tasks.slice();
	tasks[index] = action(tasks[index])
	return tasks
}

function applyEvent(project: Project, [name, data]: ClientEvent): Project {
	if (name == "createTask") {
		const event = data as CreateTaskEvent;
		return {
			...project,
			tasks: [
				...project.tasks,
				{
					completed: false,
					archived: false,
					name: event.name,
					description: event.description,
					labels: event.labels,
					id: project.historyCount,
				},
			],
			historyCount: project.historyCount + 1,
			taskCount: project.taskCount + 1,
		};
	} else if (name == "editTask") {
		const event = data as EditTaskEvent;


		return {
			...project,
			tasks: editTasks(project, event.id, (t) => {

				let task = {
					...t,
				};
				const fields: (keyof Task & keyof EditTaskEvent)[] = [
					"name",
					"description",
					"archived",
					"completed",
				];
				for (const field of fields) {
					if (event[field] != undefined) {
						//@ts-ignore
						task[field] = event[field];
					}
				}
				return task

			}),
			historyCount: project.historyCount + 1,
		};
	} else if (name == "deleteTask") {
		const event = data as DeleteTaskEvent;
		return {
			...project,
			tasks: project.tasks.filter((task) => task.id != event.id),
			historyCount: project.historyCount + 1,
		};
	} else if (name == "addLabel") {
		const event = data as AddLabelEvent;

		return {
			...project,
			tasks: editTasks(project, event.id, (task) => {
				const labels = task.labels ? task.labels.slice() : []
				labels.push(event.name)
				return {
					...task,
					labels: labels,
				}
			}),
			historyCount: project.historyCount + 1,
		};
	} else if (name == "deleteLabel") {
		const event = data as DeleteLabelEvent;

		return {
			...project,
			tasks: editTasks(project, event.id, (task) => {
				const labels = task.labels ? task.labels.slice() : []
				return {
					...task,
					labels: labels.filter((label) => label != event.name),
				}
			}),
			historyCount: project.historyCount + 1,
		};

	} else {
		console.error("couldn't apply event " + name);
	}
	return project;
}

export type ProjectSync = IncrementalSync<Project, ClientEvent>;

export function useProjectSync(id: number): ProjectSync {
	return useIncrementalData(
		() => getProject({ projectId: id }),
		(events, data) =>
			syncProject({
				projectId: data.id,
				changes: events,
				index: data.historyCount,
			}),
		applyEvent,
	);
}

export default function useClientData(): ClientData {
	return useSyncClient(getAppData);
}
