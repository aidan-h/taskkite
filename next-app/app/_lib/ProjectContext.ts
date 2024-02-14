import {
	AddLabelEvent,
	CreateTaskEvent,
	DeleteLabelEvent,
	DeleteTaskEvent,
	EditTaskEvent,
	Project,
} from "./data";
import { SyncStatus } from "./sync";
import { ProjectSync } from "./projectSync";
import { createContext } from "react";

export interface ProjectInterface {
	status: SyncStatus,
	project: Project;
	sync: () => void;
	createTask: (e: CreateTaskEvent) => void;
	editTask: (e: EditTaskEvent) => void;
	deleteTask: (e: DeleteTaskEvent) => void;
	addLabel: (e: AddLabelEvent) => void;
	deleteLabel: (e: DeleteLabelEvent) => void;
}

const defaultProject = {
	id: -1,
	tasks: [],
	taskCount: 0,
	historyCount: 0,
	name: "null",
	owner: "null@null.com",
};

export const ProjectContext = createContext<ProjectInterface>({
	project: defaultProject,
	status: SyncStatus.SYNCED,
	sync: () => console.error("cannot sync project context"),
	createTask: (_) => console.error("cannot sync project context"),
	editTask: (_) => console.error("cannot sync project context"),
	deleteTask: (_) => console.error("cannot sync project context"),
	addLabel: (_) => console.error("cannot sync project context"),
	deleteLabel: (_) => console.error("cannot sync project context"),
});

export function createProjectInterface(projectSync: ProjectSync): ProjectInterface | undefined {
	return {
		sync: () => projectSync.fetch(),
		status: projectSync.status,
		project: projectSync.data,
		editTask: (e: EditTaskEvent) => projectSync.emit(["editTask", e]),
		deleteTask: (e: DeleteTaskEvent) =>
			projectSync.emit(["deleteTask", e]),
		createTask: (e: CreateTaskEvent) =>
			projectSync.emit(["createTask", e]),
		addLabel: (e: AddLabelEvent) => projectSync.emit(["addLabel", e]),
		deleteLabel: (e: DeleteLabelEvent) =>
			projectSync.emit(["deleteLabel", e]),
	}
}
