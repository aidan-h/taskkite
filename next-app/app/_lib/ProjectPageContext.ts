import { createContext } from "react";
import { ClientProject } from "./slices/projectsSlice";

const ProjectPageContext = createContext({} as ClientProject);

export default ProjectPageContext;
