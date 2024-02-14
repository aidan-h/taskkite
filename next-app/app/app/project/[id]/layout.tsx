"use client";

import Descriptor from "@/app/_components/Descriptor";
import Hero from "@/app/_components/Hero";
import SyncStatus from "@/app/_components/SyncStatus";
import { ProjectContext } from "@/app/_lib/ProjectContext";
import {
	AddLabelEvent,
	CreateTaskEvent,
	DeleteLabelEvent,
	DeleteTaskEvent,
	EditTaskEvent,
} from "@/app/_lib/data";
import { useProjectSync } from "@/app/_lib/useUserData";
export default function ProjectLayout({
	params,
	children,
}: {
	params: { id: string };
	children: React.ReactNode;
}) {
	const projectId = parseInt(params.id);
	const projectData = useProjectSync(projectId);

	if (projectData.data) {
		return (
			<ProjectContext.Provider
				value={{
					sync: () => projectData.fetch(),
					status: projectData.status,
					project: projectData.data,
					editTask: (e: EditTaskEvent) => projectData.emit(["editTask", e]),
					deleteTask: (e: DeleteTaskEvent) =>
						projectData.emit(["deleteTask", e]),
					createTask: (e: CreateTaskEvent) =>
						projectData.emit(["createTask", e]),
					addLabel: (e: AddLabelEvent) => projectData.emit(["addLabel", e]),
					deleteLabel: (e: DeleteLabelEvent) =>
						projectData.emit(["deleteLabel", e]),
				}}
			>
				<SyncStatus />
				{children}
			</ProjectContext.Provider>
		);
	}

	return (
		<Hero>
			<Descriptor>Loading project</Descriptor>
		</Hero>
	);
}
