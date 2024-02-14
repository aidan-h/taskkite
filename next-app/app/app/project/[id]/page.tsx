"use client";
import { TaskList } from "@/app/_components/TaskList";
import { useProjectData } from "@/app/_lib/useUserData";

export default function Page({ params }: { params: { id: string } }) {
	const projectId = parseInt(params.id);
	const projectData = useProjectData(projectId)

	if (projectData.data) {
		return (
			<div>
				Project {params.id}
				<TaskList createTask={(e) => projectData.emit(["createTask", e])}
					tasks={projectData.data.tasks}
					editTask={(e) => projectData.emit(["editTask", e])}
					deleteTask={(e) => projectData.emit(["deleteTask", e])}></TaskList>
			</div>
		);
	}

	return <div>Loading project</div>;
}
