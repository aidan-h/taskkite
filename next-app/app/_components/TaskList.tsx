import { useState } from "react";
import {
  CreateTaskEvent,
  DeleteTaskEvent,
  EditTaskEvent,
  Task,
} from "../_lib/data";
import TaskCreation, { TaskEditing } from "./TaskCreation";

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
    <div className="bg-white rounded-xl max-w-sm m-4 p-3">
      <h2 className="text-lg">{task.name}</h2>
      <p className="text-slate-500">{task.description}</p>
      <button onClick={openTask}>Edit</button>
      <br />
      <button onClick={() => editTask({ ...task, completed: !task.completed })}>
        {task.completed ? "Done" : "Complete"}
      </button>
      <br />
      <button onClick={() => editTask({ ...task, archived: true })}>
        Archive
      </button>
      <br />
      <button onClick={() => deleteTask({ id: task.id })}>Delete</button>
      <br />
    </div>
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
