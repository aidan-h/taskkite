"use client";

import Descriptor from "@/app/_components/Descriptor";
import Hero from "@/app/_components/Hero";
import SyncStatus from "@/app/_components/SyncStatus";
import { useAppSelector } from "@/app/_lib/hooks";
import ProjectPageContext from "@/app/_lib/slices/ProjectPageContext";

export default function ProjectLayout({
  params,
  children,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
  const projectId = parseInt(params.id);
  const projects = useAppSelector((app) => app.projects);
  const project = projects.find((p) => p.id == projectId);

  if (!project) return <div>Project not found</div>;

  if (project.data) {
    return (
      <ProjectPageContext.Provider
        value={{ data: project.data, project: project }}
      >
        {children}
      </ProjectPageContext.Provider>
    );
  }

  return (
    <Hero>
      <Descriptor>Loading project</Descriptor>
    </Hero>
  );
}
