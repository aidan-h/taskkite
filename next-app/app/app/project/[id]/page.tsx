"use client";
import { CenterContainer } from "@/app/_components/CenterContainer";
import ProjectSettingsButton from "@/app/_components/ProjectSettingsButton";
import { TaskList } from "@/app/_components/TaskList";
import Title from "@/app/_components/Title";
import { ProjectContext } from "@/app/_lib/ProjectContext";

export default function Page() {
  return (
    <ProjectContext.Consumer>
      {({ project }) => (
        <CenterContainer>
          <Title>{project.name}</Title>
          <TaskList />
          <ProjectSettingsButton id={project.id} />
        </CenterContainer>
      )}
    </ProjectContext.Consumer>
  );
}
