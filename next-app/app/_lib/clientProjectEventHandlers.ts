import {
	EditTaskEvent,
	ProjectData,
	ProjectEvents,
	Task,
} from "./schemas";
import { EventHandlers } from "./sync";

export const clientProjectEventHandlers: EventHandlers<ProjectEvents, ProjectData> = {
	createTask: (project, event) => {
		project.tasks.push(
			{
				completed: false,
				archived: false,
				name: event.name,
				description: event.description,
				labels: event.labels,
				id: project.historyCount,
				dueDate: event.dueDate,
				dueTime: event.dueTime,
			});
		project.taskCount++;
	},
	editTask: (project, event) => {
		const task = project.tasks.find((task) => task.id == event.id);
		if (!task) return;
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
	},
	deleteTask: (project, event) => {
		project.tasks.filter((task) => task.id != event.id);
	},
	addLabel: (project, event) => {
		const task = project.tasks.find((task) => task.id == event.id);
		if (!task) return;
		if (!task.labels) task.labels = [];
		if (task.labels.find((label) => label == event.name) == undefined)
			task.labels.push(event.name)
	},
	deleteLabel: (project, event) => {
		const task = project.tasks.find((task) => task.id == event.id);
		if (!task || !task.labels) return;
		task.labels.filter((label) => label != event.name) == undefined
	}
};
