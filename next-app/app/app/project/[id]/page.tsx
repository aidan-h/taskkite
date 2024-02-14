"use client";
import { CenterContainer } from "@/app/_components/CenterContainer";
import ProjectSettingsButton from "@/app/_components/ProjectSettingsButton";
import TaskCreation from "@/app/_components/TaskCreation";
import { ActiveTaskList, TaskList } from "@/app/_components/TaskList";
import Title from "@/app/_components/Title";
import ProjectPageContext from "@/app/_lib/slices/ProjectPageContext";
import { useContext, useState } from "react";

export default function Page() {
  const [showCompleted, setShowCompleted] = useState(false);
  const { project, data } = useContext(ProjectPageContext);
  return (
    <CenterContainer>
      <Title>{project.name}</Title>
      <ActiveTaskList projectId={project.id} project={data} />
      <TaskCreation projectId={project.id} />
      <button
        className="block mx-auto underline underline-offset-4 hover:text-indigo-500 mb-4 px-4"
        onClick={() => setShowCompleted(!showCompleted)}
      >
        {showCompleted ? "Hide completed tasks" : "Show completed tasks"}
      </button>
      {showCompleted ? (
        <TaskList
          projectId={project.id}
          tasks={data.tasks.filter((task) => !task.archived && task.completed)}
        />
      ) : undefined}
      <ProjectSettingsButton id={project.id} />
    </CenterContainer>
  );
}
