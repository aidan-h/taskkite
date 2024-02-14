import { createContext } from "react";
import { Project } from "./schemas";

const ProjectPageContext = createContext({} as Project);

export default ProjectPageContext;
