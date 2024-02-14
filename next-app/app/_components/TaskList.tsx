import { useState } from "react";
import { DateTime } from "luxon";
import { DeleteTaskEvent, EditTaskEvent, Task } from "../_lib/data";
import TaskCreation, { Labels, TaskEditing } from "./TaskCreation";
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
			<SecondaryListItem>
				{b}
				<BottomRightContainer>
					<ProjectContext.Consumer>
						{({ editTask }) => (
							<button
								className="text-center rounded text-sm shadow bg-slate-50 py-1 px-2"
								onClick={() => editTask({ id: task.id, completed: false })}
							>
								Undo
							</button>
						)}
					</ProjectContext.Consumer>
				</BottomRightContainer>
			</SecondaryListItem>
		);

	return (
		<ListItem>
			{b}
			<BottomRightContainer>
				<button
					className="text-center rounded text-sm shadow bg-slate-50 py-1 px-2"
					onClick={openTask}
				>
					Edit
				</button>
				<ProjectContext.Consumer>
					{({ editTask }) => (
						<button
							className="text-center rounded text-sm shadow bg-slate-50 py-1 px-2"
							onClick={() => editTask({ id: task.id, completed: true })}
						>
							Complete
						</button>
					)}
				</ProjectContext.Consumer>
			</BottomRightContainer>
		</ListItem>
	);
}

function sortTasks(a: Task, b: Task): number {
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
export function TaskList() {
	const [taskEditing, setTaskEditing] = useState(
		undefined as undefined | number,
	);
	return (
		<ProjectContext.Consumer>
			{({ project }) => (
				<div>
					{project.tasks
						.filter((task) => !task.archived)
						.sort(sortTasks)
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
						})}
					<TaskCreation />
				</div>
			)}
		</ProjectContext.Consumer>
	);
}
