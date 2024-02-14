"use client";

import { ProjectContext } from "@/app/_lib/ProjectContext";
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
        value={{ project: projectData.data, sync: projectData }}
      >
        {children}
      </ProjectContext.Provider>
    );
  }

  return <div>Loading project</div>;
}
