import { createContext } from "react";
import { ProjectData } from "../data";
import { Project } from "./projectsSlice";

const ProjectPageContext = createContext({
  data: {} as ProjectData,
  project: {} as Project,
});

export default ProjectPageContext;
