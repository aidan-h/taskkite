"use client";
import { ProjectContext } from "@/app/_lib/ProjectContext";
import { deleteProject } from "@/app/_lib/api";
import { AppDataContext } from "@/app/_lib/useUserData";
import { useRouter } from "next/navigation";
import { useState } from "react";

function BackComponent({ id }: { id: number }) {
  const router = useRouter();
  return (
    <button onClick={() => router.push("/app/project/" + id)}>Back</button>
  );
}

function DeleteProject({ id }: { id: number }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  if (deleting) {
    return <div>Deleting project</div>;
  }
  return (
    <AppDataContext.Consumer>
      {(appData) => (
        <button
          onClick={() => {
            setDeleting(true);
            deleteProject(id)
              .then(() => {
                appData.update();
                router.push("/app");
              })
              .catch(() => setDeleting(false));
          }}
        >
          Delete Project
        </button>
      )}
    </AppDataContext.Consumer>
  );
}

export default function Page() {
  return (
    <ProjectContext.Consumer>
      {({ project, sync }) => (
        <div>
          Project Settings for {project.name}
          <br />
          <DeleteProject id={project.id} />
          <br />
          <BackComponent id={project.id} />
        </div>
      )}
    </ProjectContext.Consumer>
  );
}
