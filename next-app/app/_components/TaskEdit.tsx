"use client";
import { pushProjectEvent } from "../_lib/slices/projectsSlice";
import { useAppDispatch } from "../_lib/hooks";
import useProjects from "../_lib/useProjects";
import TaskForm, { TaskFormContext } from "./TaskForm";
import { EditTaskEvent, Task } from "../_lib/schemas";

export default function TaskEdit({ projectId, task, cancel }: {
	projectId: number, cancel: () => void, task: Task
}) {
	const dispatch = useAppDispatch();
	const projects = useProjects()
	return (
		<TaskFormContext.Provider value={cancel}>
			<TaskForm
				task={task}
				onSubmit={(task) => {
					const event: EditTaskEvent = {
						...task,
						projectId: projectId
					}
					dispatch(pushProjectEvent(
						["editTask", event], projects));
					cancel();
				}
				}
			/>
		</TaskFormContext.Provider>
	);
}
