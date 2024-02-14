"use client";
import { useState } from "react";
import { Project, Task } from "../_lib/data";
import { TaskEditing } from "./TaskCreation";
import TaskComponent, { getTaskDateTime } from "./TaskComponent";

function sortTasks(a: Task, b: Task): number {
	if (a.completed && !b.completed)
		return 1
	if (b.completed && !a.completed)
		return -1
	const aT = getTaskDateTime(a)
	const bT = getTaskDateTime(b)
	if (aT == undefined)
		return bT == undefined ? 0 : 1
	if (bT == undefined)
		return -1
	if (aT < bT)
		return -1
	if (aT == bT)
		return 0
	return 1

}

export function TaskList({ tasks }: { tasks: Task[] }) {
	const [taskEditing, setTaskEditing] = useState(
		undefined as undefined | number,
	);
	return tasks.sort(sortTasks)
		.map((task) => {
			if (task.id == taskEditing)
				return (
					<TaskEditing
						close={() => setTaskEditing(undefined)}
						key={task.id}
						task={task}
					></TaskEditing>
				);
			return (
				<TaskComponent
					openTask={() => setTaskEditing(task.id)}
					key={task.id}
					task={task}
				></TaskComponent>
			);
		})
}

export function ActiveTaskList({ project }: { project: Project }) {
	return (
		<TaskList tasks={project.tasks.filter((task) => !task.archived && !task.completed)} />
	);
}
