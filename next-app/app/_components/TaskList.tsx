import { useState } from "react";
import { DeleteTaskEvent, EditTaskEvent, Task } from "../_lib/data";
import TaskCreation, { Labels, TaskEditing } from "./TaskCreation";
import { ListItem, SecondaryListItem } from "./listItems";
import BottomRightContainer from "./BottomRightContainer";
import { ProjectContext } from "../_lib/ProjectContext";

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

export type DeleteTask = (e: DeleteTaskEvent) => void;
export type EditTask = (e: EditTaskEvent) => void;

function TaskWidget({ task, openTask }: { task: Task; openTask: () => void }) {
	const b = <>
		<h2 className="text-md text-left">{task.name}</h2>
		<Labels labels={task.labels} onClick={() => { }} />
		{task.dueDate ? <p className="text-left">{new Date(task.dueDate.toString() + " " + task.dueTime?.toString()).toLocaleString()}</p> : undefined}
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
								<TaskWidget
									openTask={() => setTaskEditing(task.id)}
									key={task.id}
									task={task}
								></TaskWidget>
							);
						})}
					<TaskCreation />
				</div>
			)}
		</ProjectContext.Consumer>
	);
}
