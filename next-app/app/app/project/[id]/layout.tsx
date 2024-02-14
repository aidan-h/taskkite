"use client";

import Descriptor from "@/app/_components/Descriptor";
import Hero from "@/app/_components/Hero";
import SyncStatus from "@/app/_components/SyncStatus";
import { ProjectContext, ProjectInterface, createProjectInterface } from "@/app/_lib/ProjectContext";
import {
	AddLabelEvent,
	CreateTaskEvent,
	DeleteLabelEvent,
	DeleteTaskEvent,
	EditTaskEvent,
} from "@/app/_lib/data";
import { ProjectSync } from "@/app/_lib/projectSync";
import { AppDataContext } from "@/app/_lib/useUserData";
import { useContext } from "react";


export default function ProjectLayout({
	params,
	children,
}: {
	params: { id: string };
	children: React.ReactNode;
}) {
	const projectId = parseInt(params.id);
	const appData = useContext(AppDataContext)
	const projectData = appData.projects.find((p) => p.id == projectId)

	if (!projectData)
		return <div>Project not found</div>

	if (projectData.data) {
		return (
			<ProjectContext.Provider
				value={createProjectInterface(projectData)!}
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
