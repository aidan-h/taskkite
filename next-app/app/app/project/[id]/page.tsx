'use client'
import { TaskList } from "@/app/_components/TaskList";
import { getProjectTasks } from "@/app/_lib/api";
import { Task } from "@/app/_lib/data";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
	const projectId = parseInt(params.id)
	const [tasks, setTasks] = useState(null as null | Task[] | Error);
	useEffect(() => {
		getProjectTasks(projectId).then((v) => setTasks(v), (err) => {
			console.error(err)
			setTasks(err)
		});
	}, [])

	if (tasks instanceof Error) {
		return <div>Error loading tasks</div>
	}

	if (tasks) {
		return <div>Project {params.id}
			<TaskList tasks={tasks}></TaskList>
		</div>
	}

	return <div>Loading tasks</div>
}
