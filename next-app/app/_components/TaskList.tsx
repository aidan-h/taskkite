import { useState } from "react";
import {
	CreateTaskEvent,
	DeleteTaskEvent,
	EditTaskEvent,
	Task,
} from "../_lib/data";
import TaskCreation, { TaskEditing } from "./TaskCreation";
import { ListItem, ListItemButton } from "./listItems";
import BottomRightContainer from "./BottomRightContainer";

function tomorrow() {
	const tomorrow = new Date();
	tomorrow.setTime(tomorrow.getTime() + 24 * 60 * 60 * 1000);
	return tomorrow;
}

function sameDay(a: Date, b: Date): boolean {
	return (
		a.getFullYear() == b.getFullYear() &&
		a.getMonth() == b.getMonth() &&
		a.getDate() == b.getDate()
	);
}

interface Account {
	tasks: Task[];
}

export type DeleteTask = (e: DeleteTaskEvent) => void;
export type EditTask = (e: EditTaskEvent) => void;

function TaskWidget({
	task,
	deleteTask,
	editTask,
	openTask,
}: {
	openTask: () => void;
	task: Task;
	deleteTask: DeleteTask;
	editTask: EditTask;
}) {
	return (
		<ListItem>
			<h2 className="text-md text-left">{task.name}</h2>
			<p className="text-slate-500 text-sm text-left mb-2">{task.description}</p>
			<BottomRightContainer>
				<button className="text-center rounded text-sm shadow bg-slate-50 py-1 px-2" onClick={openTask}>Edit</button>
				<button className="text-center rounded text-sm shadow bg-slate-50 py-1 px-2" onClick={() => editTask({ ...task, completed: !task.completed })}>
					{task.completed ? "Done!" : "Complete"}
				</button>
			</BottomRightContainer>
		</ListItem>
	);
}

export function TaskList({
	tasks,
	createTask,
	deleteTask,
	editTask,
}: {
	editTask: EditTask;
	tasks: Task[];
	createTask: (event: CreateTaskEvent) => void;
	deleteTask: DeleteTask;
}) {
	const [taskEditing, setTaskEditing] = useState(
		undefined as undefined | number,
	);
	return (
		<div>
			{tasks
				.filter((task) => !task.archived)
				.map((task) => {
					if (task.id == taskEditing)
						return (
							<TaskEditing
								close={() => setTaskEditing(undefined)}
								key={task.id}
								task={task}
								editTask={editTask}
							></TaskEditing>
						);
					return (
						<TaskWidget
							openTask={() => setTaskEditing(task.id)}
							key={task.id}
							task={task}
							deleteTask={deleteTask}
							editTask={editTask}
						></TaskWidget>
					);
				})}
			<TaskCreation createTask={createTask} />
		</div>
	);
}
