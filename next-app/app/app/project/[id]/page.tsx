"use client";
import AccountButton from "@/app/_components/AccountButton";
import { CenterContainer } from "@/app/_components/CenterContainer";
import ProjectSettingsButton from "@/app/_components/ProjectSettingsButton";
import { TaskList } from "@/app/_components/TaskList";
import Title from "@/app/_components/Title";
import { ProjectContext } from "@/app/_lib/ProjectContext";

export default function Page() {
	return (
		<ProjectContext.Consumer>
			{({ project, sync }) => (
				<CenterContainer>
					<Title>{project.name}</Title>
					<TaskList
						createTask={(e) => sync.emit(["createTask", e])}
						tasks={project.tasks}
						editTask={(e) => sync.emit(["editTask", e])}
						deleteTask={(e) => sync.emit(["deleteTask", e])}
					></TaskList>
					<AccountButton />
					<ProjectSettingsButton id={project.id} />
				</CenterContainer>
			)}
		</ProjectContext.Consumer>
	);
}
