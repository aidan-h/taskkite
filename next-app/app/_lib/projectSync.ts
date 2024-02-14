import { Draft } from "@reduxjs/toolkit";
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

function editTasks(
	project: ProjectData,
	id: number,
	action: (task: Task) => Task,
): Task[] {
	const index = project.tasks.findIndex((task) => task.id == id);
	if (index == -1) {
		console.error("couldn't apply event to unfound task", project);
		return project.tasks;
	}
	let tasks = project.tasks.slice();
	tasks[index] = action(tasks[index]);
	return tasks;
}

interface EV {
	createTask: CreateTaskEvent,
	editTask: EditTaskEvent,
	deleteTask: DeleteTaskEvent,
	addLabel: AddLabelEvent,
	deleteLabel: DeleteLabelEvent
}

type N = {
	[Key in keyof EV]: (project: Draft<ProjectData>, event: EV[Key]) => void;
}

const n: N = {
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
