"use client";
import { useContext, useState } from "react";
import { DateTime } from "luxon";
import { DeleteTaskEvent, EditTaskEvent, Project, Task } from "../_lib/data";
import { Labels, TaskEditing } from "./TaskCreation";
import { ListItem, SecondaryListItem } from "./listItems";
import BottomRightContainer from "./BottomRightContainer";
import { ProjectContext } from "../_lib/ProjectContext";

export type DeleteTask = (e: DeleteTaskEvent) => void;
export type EditTask = (e: EditTaskEvent) => void;

function dateToDueString(dateTime: DateTime): string {
	const diffInDays = Math.ceil(dateTime.diff(DateTime.now(), "days").as("days"))
	if (diffInDays < 0)
		return "Past due " + (-diffInDays) + " days ago"
	if (diffInDays == 0)
		return "Today"
	if (diffInDays == 1)
		return "Tomorrow"
	if (diffInDays <= 7)
		return "Next " + dateTime.weekdayLong
	return "In " + diffInDays + " days"
}

function getTaskDateTime(task: Task): DateTime | undefined {
	if (task.dueDate)
		if (task.dueTime) {
			return DateTime.fromSQL(task.dueDate + " " + task.dueTime)
		} else
			return DateTime.fromSQL(task.dueDate)
	return undefined
}

function getDueString(task: Task): string | undefined {
	if (!task.dueDate) return ""

	const first = dateToDueString(DateTime.fromSQL(task.dueDate.toString()));

	if (task.dueTime) {
		return first + " at " + DateTime.fromSQL(task.dueTime).toLocaleString(DateTime.TIME_SIMPLE);
	}


	return first;
}

function TaskComponent({ task, openTask }: { task: Task; openTask: () => void }) {
	const { editTask } = useContext(ProjectContext)
	const due = getDueString(task)
	const b = <>
		<h2 className="text-md text-left">{task.name}</h2>
		<Labels labels={task.labels} onClick={() => { }} />
		{due ? <p className="text-left">{due}</p> : undefined}
		<p className="text-slate-500 text-sm text-left mb-2">
			{task.description}
		</p>
	</>

	if (task.completed)
		return (
			<SecondaryListItem
				onClick={() => editTask({ id: task.id, completed: false })}>
				{b}
			</SecondaryListItem>
		);

	return (
		<ListItem
			onClick={openTask}>
			{b}
			<BottomRightContainer>
				<button
					className="text-center rounded text-sm shadow bg-slate-50 py-1 px-2"
					onClick={(e) => { e.stopPropagation(); editTask({ id: task.id, completed: true }) }}
				>
					Complete
				</button>
			</BottomRightContainer>
		</ListItem>
	);
}

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
