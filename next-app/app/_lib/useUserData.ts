import { createContext } from "react";
import { getAppData, getProject, syncProject } from "./api";
import {
  AppData,
  ClientEvent,
  CreateTaskEvent,
  DeleteTaskEvent,
  EditTaskEvent,
  Project,
} from "./data";
import {
  IncrementalData,
  SyncClient,
  SyncStatus,
  useIncrementalData,
  useSyncClient,
} from "./sync";

export const AppDataContext = createContext<AppData>({
  email: "test@test.com",
  name: "test",
  projects: [],
});

export const SyncStateContext = createContext<SyncStatus>(SyncStatus.PENDING);

export type ProjectClientData = SyncClient<Project> & {
  emitEvent: (event: ClientEvent) => void;
};

export type ClientData = SyncClient<AppData>;

function applyEvent(project: Project, [name, data]: ClientEvent): Project {
  if (name == "createTask") {
    const event = data as CreateTaskEvent;
    return {
      ...project,
      tasks: [
        ...project.tasks,
        {
          name: event.name,
          description: event.description,
          labels: event.labels,
          id: project.historyCount,
        },
      ],
      historyCount: project.historyCount + 1,
      taskCount: project.taskCount + 1,
    };
  } else if (name == "editTask") {
    const event = data as EditTaskEvent;
    let tasks = project.tasks.slice();
    const index = tasks.findIndex((task) => task.id == event.id);
    if (index == -1) {
      console.error("couldn't apply event to unfound task", event, project);
      return project;
    }

    tasks[index] = {
      name: event.name,
      description: event.description,
      labels: event.labels,
      archived: event.archived,
      completed: event.completed,
      id: event.id,
    };

    return {
      ...project,
      tasks: tasks,
      historyCount: project.historyCount + 1,
    };
  } else if (name == "deleteTask") {
    const event = data as DeleteTaskEvent;
    return {
      ...project,
      tasks: project.tasks.filter((task) => task.id != event.id),
      historyCount: project.historyCount + 1,
    };
  } else {
    console.error("couldn't apply event " + name);
  }
  return project;
}

export function useProjectData(
  id: number,
): IncrementalData<Project, ClientEvent> {
  return useIncrementalData(
    () => getProject({ projectId: id }),
    (events, data) =>
      syncProject({
        projectId: data.id,
        changes: events,
        index: data.historyCount,
      }),
    applyEvent,
  );
}

export default function useClientData(): ClientData {
  return useSyncClient(getAppData);
}
