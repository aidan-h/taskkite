"use client";
import { TaskList } from "@/app/_components/TaskList";
import { ProjectContext } from "@/app/_lib/ProjectContext";
import { useRouter } from "next/navigation";

function Settings({ id }: { id: number; }) {
	const router = useRouter()
	return <button onClick={() => router.push("/app/project/" + id + "/settings")}>Settings</button>
}

export default function Page() {
	return <ProjectContext.Consumer>
		{({ project, sync }) =>
			<div>
				Project {project.name}
				<TaskList createTask={(e) => sync.emit(["createTask", e])}
					tasks={project.tasks}
					editTask={(e) => sync.emit(["editTask", e])}
					deleteTask={(e) => sync.emit(["deleteTask", e])}></TaskList>
				<Settings id={project.id}></Settings>
			</div>
		}
	</ProjectContext.Consumer>
}
