import {
	EditTaskEvent,
	Project,
	ProjectEvents,
	Task,
} from "./schemas";
import { EventHandlers } from "./sync";

export const clientProjectEventHandlers: EventHandlers<ProjectEvents, Project> = {
	updateName: ({ data }, event) => {
		data.name = event.name
	},
	createTask: ({ data }, event) => {
		data.tasks.push(
			{
				completed: false,
				archived: false,
				name: event.name,
				description: event.description,
				labels: event.labels,
				id: data.taskCount,
				dueDate: event.dueDate,
				dueTime: event.dueTime,
			});
		data.taskCount++;
	},
	editTask: ({ data }, event) => {
		const task = data.tasks.find((task) => task.id == event.id);
		if (!task) return;
		const fields: (keyof Task & keyof EditTaskEvent)[] = [
			"name",
			"labels",
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
	deleteTask: ({ data }, event) => {
		data.tasks.filter((task) => task.id != event.id);
	},
	addLabel: ({ data }, event) => {
		const task = data.tasks.find((task) => task.id == event.id);
		if (!task) return;
		if (!task.labels) task.labels = [];
		if (task.labels.find((label) => label == event.name) == undefined)
			task.labels.push(event.name)
	},
	deleteLabel: ({ data }, event) => {
		const task = data.tasks.find((task) => task.id == event.id);
		if (!task || !task.labels) return;
		task.labels.filter((label) => label != event.name) == undefined
	}
};
