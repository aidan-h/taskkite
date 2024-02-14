"use client";
import { useState } from "react";
import { SecondaryListItemButton } from "./listItems";
import { pushProjectEvent } from "../_lib/slices/projectsSlice";
import { useAppDispatch } from "../_lib/hooks";
import useProjects from "../_lib/useProjects";
import TaskForm, { TaskFormContext } from "./TaskForm";

export default function TaskCreation({ projectId }: { projectId: number }) {
	const [active, setActive] = useState(false);
	const dispatch = useAppDispatch();
	const projects = useProjects()
	if (active)
		return (
			<TaskFormContext.Provider value={() => setActive(false)}>
				<TaskForm
					task={{
						name: "New Task",
						id: -1,
						archived: false,
						completed: false,
						labels: [],
					}}
					onSubmit={(task) => {
						dispatch(pushProjectEvent(
							["createTask", {
								projectId: projectId,
								name: task.name,
								description: task.description,
								labels: task.labels,
								dueTime: task.dueTime,
								dueDate: task.dueDate,
							}], projects)); setActive(false)
					}
					}
				/></TaskFormContext.Provider>
		);
	return (
		<SecondaryListItemButton onClick={() => setActive(true)}>
			Create task
		</SecondaryListItemButton>
	);
}
