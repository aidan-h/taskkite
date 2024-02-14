import { createContext } from "react";
import { ProjectData } from "../schemas";

const ProjectPageContext = createContext({
	data: {} as ProjectData,
	project: {} as Project,
});

export default ProjectPageContext;
