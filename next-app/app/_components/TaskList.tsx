"use client";
import { useContext, useState } from "react";
import Image from "next/image"
import { DateTime } from "luxon";
import { DeleteTaskEvent, EditTaskEvent, Project, Task } from "../_lib/data";
import { Labels, TaskEditing } from "./TaskCreation";
import { ListItem, SecondaryListItem } from "./listItems";
import { ProjectContext } from "../_lib/ProjectContext";

export type DeleteTask = (e: DeleteTaskEvent) => void;
export type EditTask = (e: EditTaskEvent) => void;

enum DueState {
	PAST,
	SOON,
	FUTURE,
}

function dateToDueString(dateTime: DateTime): [string, DueState] {
	const diffInDays = Math.ceil(dateTime.diff(DateTime.now(), "days").as("days"))
	if (diffInDays < 0)
		return [dateTime.monthShort + " " + dateTime.daysInMonth, DueState.PAST]
	if (diffInDays == 0)
		return ["Today", DueState.SOON]
	if (diffInDays == 1)
		return ["Tomorrow", DueState.FUTURE]
	if (diffInDays <= 7)
		return [dateTime.weekdayLong, DueState.FUTURE]
	return [dateTime.monthShort + " " + dateTime.daysInMonth, DueState.FUTURE]
}

function getTaskDateTime(task: Task): DateTime | undefined {
	if (task.dueDate)
		if (task.dueTime) {
			return DateTime.fromSQL(task.dueDate + " " + task.dueTime)
		} else
			return DateTime.fromSQL(task.dueDate)
	return undefined
}

function getDueString(task: Task): [string, DueState] | undefined {
	if (!task.dueDate) return undefined

	const [first, state] = dateToDueString(DateTime.fromSQL(task.dueDate.toString()));

	if (task.dueTime) {
		return [first + " at " + DateTime.fromSQL(task.dueTime).toLocaleString(DateTime.TIME_SIMPLE), state];
	}


	return [first, state];
}

function TaskComponent({ task, openTask }: { task: Task; openTask: () => void }) {
	const { editTask } = useContext(ProjectContext)
	const due = getDueString(task)
	const b = <div className="ml-4">
		<h2 className="text-md text-left">{task.name}</h2>
		<Labels labels={task.labels} onClick={() => { }} />
		{due ? <p className="text-left">{due[0]}</p> : undefined}
	</div>

	if (task.completed)
		return (
			<SecondaryListItem
				onClick={() => editTask({ id: task.id, completed: false })}>
				{b}
				<button
					className="absolute left-2 top-4"
					onClick={(e) => { e.stopPropagation(); editTask({ id: task.id, completed: false }) }}
				>
					<Image width={20} height={20} src="/check_box.svg" alt="complete box" />
				</button>
			</SecondaryListItem>
		);

	return (
		<ListItem
			onClick={openTask}>
			{b}
			<button
				className="absolute left-2 top-4"
				onClick={(e) => { e.stopPropagation(); editTask({ id: task.id, completed: true }) }}
			>
				<Image width={20} height={20} src="/check_box_outline_blank.svg" alt="incomplete box" />
			</button>
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
