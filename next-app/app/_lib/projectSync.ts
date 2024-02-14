import { syncProject } from "./api";
import {
	AddLabelEvent,
	ClientEvent,
	CreateTaskEvent,
	DeleteLabelEvent,
	DeleteTaskEvent,
	EditTaskEvent,
	ProjectData,
	Task,
} from "./data";
import {
	SyncStatus,
	getPushEvent,
	PushEvent,
	Shadow,
	SyncState,
} from "./sync";


function editTasks(project: ProjectData, id: number, action: (task: Task) => Task): Task[] {
	const index = project.tasks.findIndex((task) => task.id == id);
	if (index == -1) {
		console.error("couldn't apply event to unfound task", project);
		return project.tasks;
	}
	let tasks = project.tasks.slice();
	tasks[index] = action(tasks[index])
	return tasks
}

function applyEvent(project: ProjectData, [name, data]: ClientEvent): ProjectData {
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
	id: number;
	emit: PushEvent<ClientEvent>;
	data: ProjectData | undefined;
	status: SyncStatus;
	fetch: () => void;
}

export interface ProjectSyncParameters {
	shadow: Shadow<ProjectData, ClientEvent> | undefined;
	setShadow: (shadow: Shadow<ProjectData, ClientEvent> | undefined) => void;
	id: number;
	state: SyncState<ProjectData>;
	setState: (state: SyncState<ProjectData>) => void;
	fetch: () => void;
}

export function createProjectSync(p: ProjectSyncParameters): ProjectSync {
	return {
		id: p.id,
		fetch: p.fetch,
		data: p.state.data,
		status: p.state.status,
		emit: getPushEvent(
			(events, data) =>
				syncProject({
					projectId: p.id,
					changes: events,
					index: data.historyCount,
				}),
			p.state,
			p.setState,
			applyEvent,
			p.shadow,
			p.setShadow
		)
	};
}
