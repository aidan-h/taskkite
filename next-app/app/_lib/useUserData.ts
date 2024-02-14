import { createContext, useState } from "react";
import { getProject, syncProject } from "./api";
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
	SyncClient,
	SyncStatus,
	getPushEvent,
	PushEvent,
	Shadow,
	useSyncClient,
} from "./sync";

export const SyncStateContext = createContext<SyncStatus>(SyncStatus.PENDING);

export type ProjectClientData = SyncClient<Project> & {
	emitEvent: (event: ClientEvent) => void;
};

export type AppSync = SyncClient<AppData>;
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
		console.error("couldn't apply event to unfound task", project);
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
					dueDate: event.dueDate,
					dueTime: event.dueTime
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
					"dueDate",
					"dueTime",
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

export type ProjectSync = {
	emit: PushEvent<ClientEvent>;
	data: Project | undefined;
	status: SyncStatus;
	fetch: () => void;
}

export function useProjectSync(id: number): ProjectSync {
	const [shadow, setShadow] = useState(undefined as Shadow<Project, ClientEvent> | undefined)
	const client = useSyncClient(() => getProject({ projectId: id }));
	return {
		fetch: client.fetch,
		data: client.state.data,
		status: client.state.status,
		emit: getPushEvent(
			(events, data) =>
				syncProject({
					projectId: data.id,
					changes: events,
					index: data.historyCount,
				}),
			client.state,
			client.setState,
			applyEvent,
			shadow,
			setShadow
		)
	};
}
