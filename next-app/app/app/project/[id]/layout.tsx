"use client";

import ProjectPageContext from "@/app/_lib/ProjectPageContext";
import useProjects from "@/app/_lib/useProjects";

export default function ProjectLayout({
	params,
	children,
}: {
	params: { id: string };
	children: React.ReactNode;
}) {
	const projectId = parseInt(params.id);
	const projects = useProjects();
	const project = projects.find((p) => p.client.data.id == projectId);

	if (!project) return <div>Project not found</div>;

	return (
		<ProjectPageContext.Provider
			value={project.client.data}
		>
			{children}
		</ProjectPageContext.Provider>
	);
}
