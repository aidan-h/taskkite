import { CreateTaskEvent, DeleteTaskEvent, Task } from "../_lib/data";
import TaskCreation from "./TaskCreation";

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
function TaskWidget({ task, deleteTask }: { task: Task, deleteTask: DeleteTask }) {
	return (
		<div className="bg-white rounded-xl max-w-sm m-4 p-3">
			<h2 className="text-lg">{task.name}</h2>
			<p className="text-slate-500">{task.description}</p>
			<button onClick={() => deleteTask({ id: task.id })}>Delete</button>
		</div >
	);
}

export function TaskList({ tasks, createTask, deleteTask }: { tasks: Task[]; createTask: (event: CreateTaskEvent) => void, deleteTask: DeleteTask }) {
	return (
		<div>
			{tasks.map((task) => (
				<TaskWidget key={task.id} task={task} deleteTask={deleteTask}></TaskWidget>
			))}
			<TaskCreation createTask={createTask} />
		</div>
	);
}
