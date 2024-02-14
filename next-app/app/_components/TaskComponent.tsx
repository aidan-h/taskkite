"use client";
import { ReactNode, useContext } from "react";
import Image from "next/image"
import { DateTime } from "luxon";
import { DeleteTaskEvent, EditTaskEvent, Task } from "../_lib/data";
import { Labels } from "./TaskCreation";
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

export function getTaskDateTime(task: Task): DateTime | undefined {
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

function DueComponent({ children, state }: { children: ReactNode, state: DueState }) {
	if (state == DueState.PAST)
		return <p className="text-red-500 text-left sm:text-right sm:absolute sm:top-0 sm:right-0">{children}</p>
	if (state == DueState.SOON)
		return <p className="text-orange-500 text-left sm:text-right sm:absolute sm:top-0 sm:right-0">{children}</p>
	return <p className="text-left sm:text-right sm:absolute sm:top-0 sm:right-0">{children}</p>
}

export default function TaskComponent({ task, openTask }: { task: Task; openTask: () => void }) {
	const { editTask } = useContext(ProjectContext)
	const due = getDueString(task)
	const b = <div className="ml-6 relative">
		<h2 className="text-md text-left">{task.name}</h2>
		<Labels labels={task.labels} onClick={() => { }} />
		{due ? <DueComponent state={due[1]}>{due[0]}</DueComponent> : undefined}
	</div>

	if (task.completed)
		return (
			<SecondaryListItem
				onClick={() => editTask({ id: task.id, completed: false })}>
				{b}
				<div
					className="absolute left-0 top-0 h-full w-10"
					onClick={(e) => { e.stopPropagation(); editTask({ id: task.id, completed: false }) }}
				>
					<Image width={20} height={20} className="absolute left-3 top-5 dark:invert" src="/check_box.svg" alt="complete box" />
				</div>
			</SecondaryListItem>
		);

	return (
		<ListItem
			onClick={openTask}>
			{b}
			<div
				className="absolute left-0 top-0 h-full w-10"
				onClick={(e) => { e.stopPropagation(); editTask({ id: task.id, completed: true }) }}
			>
				<Image width={20} height={20} className="absolute left-3 top-5 dark:invert" src="/check_box_outline_blank.svg" alt="incomplete box" />
			</div>
		</ListItem>
	);
}

