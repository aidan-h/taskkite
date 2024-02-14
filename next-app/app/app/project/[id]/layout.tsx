"use client";

import { useAppSelector } from "@/app/_lib/hooks";
import ProjectPageContext from "@/app/_lib/ProjectPageContext";

export default function ProjectLayout({
	params,
	children,
}: {
	params: { id: string };
	children: React.ReactNode;
}) {
	const projectId = parseInt(params.id);
	const projects = useAppSelector((app) => app.projects.projects);
	const project = projects.find((p) => p.id == projectId);

	if (!project) return <div>Project not found</div>;

	return (
		<ProjectPageContext.Provider
			value={project}
		>
			{children}
		</ProjectPageContext.Provider>
	);
}
