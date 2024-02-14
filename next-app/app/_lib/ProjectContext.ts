import { createContext } from "react";
import {
  AddLabelEvent,
  CreateTaskEvent,
  DeleteLabelEvent,
  DeleteTaskEvent,
  EditTaskEvent,
  Project,
} from "./data";

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
  createTask: (e: CreateTaskEvent) => void;
  editTask: (e: EditTaskEvent) => void;
  deleteTask: (e: DeleteTaskEvent) => void;
  addLabel: (e: AddLabelEvent) => void;
  deleteLabel: (e: DeleteLabelEvent) => void;
}>({
  project: defaultProject,
  createTask: () => {},
  editTask: () => {},
  deleteTask: () => {},
  addLabel: () => {},
  deleteLabel: () => {},
});
