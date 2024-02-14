import { createContext } from "react";
import { Project } from "./data";
import { ProjectSync } from "./useUserData";

const defaultProject = {
  id: -1,
  tasks: [],
  taskCount: 0,
  historyCount: 0,
  name: "null",
  owner: "null@null.com",
};
export const ProjectContext = createContext<{
  project: Project;
  sync: ProjectSync;
}>({
  project: defaultProject,
  sync: {
    emit: () => {},
    fetch: () => {},
    data: defaultProject,
  },
});
