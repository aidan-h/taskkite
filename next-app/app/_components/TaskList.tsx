import { Task } from "../_lib/data";
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

function TaskWidget({ task }: { task: Task }) {
  return (
    <div className="bg-white rounded-xl max-w-sm m-4 p-3">
      <h2 className="text-lg">{task.name}</h2>
      <p className="text-slate-500">{task.description}</p>
    </div>
  );
}

export function TaskList({ tasks, id }: { tasks: Task[]; id: number }) {
  return (
    <div>
      {tasks.map((task) => (
        <TaskWidget key={task.id} task={task}></TaskWidget>
      ))}
      <TaskCreation id={id} />
    </div>
  );
}
