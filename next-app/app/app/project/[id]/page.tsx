"use client";
import { CenterContainer } from "@/app/_components/CenterContainer";
import ProjectSettingsButton from "@/app/_components/ProjectSettingsButton";
import TaskCreation from "@/app/_components/TaskCreation";
import { ActiveTaskList, TaskList } from "@/app/_components/TaskList";
import Title from "@/app/_components/Title";
import { ProjectContext } from "@/app/_lib/ProjectContext";
import { useContext, useState } from "react";

export default function Page() {
	const [showCompleted, setShowCompleted] = useState(false)
	const { project } = useContext(ProjectContext);
	return (
		<CenterContainer>
			<Title>{project.name}</Title>
			<ActiveTaskList project={project} />
			<TaskCreation />
			<button className="block mx-auto shadow rounded bg-slate-200 mb-4 px-4"
				onClick={() => setShowCompleted(!showCompleted)}>{showCompleted ? "Hide completed tasks" : "Show completed tasks"}</button>
			{showCompleted ? <TaskList tasks={project.tasks.filter((task) => !task.archived && task.completed)} /> : undefined}
			<ProjectSettingsButton id={project.id} />
		</CenterContainer>
	);
}
