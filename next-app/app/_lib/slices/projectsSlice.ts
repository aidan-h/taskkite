import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AddLabelEvent, CreateTaskEvent, DeleteLabelEvent, DeleteTaskEvent, EditTaskEvent, ProjectData, ProjectIdentifier, Task } from "../data";

export type Project = ProjectIdentifier & {
	data: ProjectData | undefined;
}

type ProjectAction = PayloadAction<{ projectId: number }>;
type TaskAction = PayloadAction<{ projectId: number, id: number }>;
function alterProject(projects: Project[], action: ProjectAction, reducer: (data: ProjectData) => void) {
	const project = projects.find((project) => project.id == action.payload.projectId);
	if (project && project.data) reducer(project.data)
}


function alterProjectTask(projects: Project[], action: TaskAction, reducer: (task: Task) => void) {
	alterProject(projects, action, (data) => {
		const task = data.tasks.find((task) => task.id == action.payload.id);
		if (task) reducer(task)
	});
}


export const projectsSlice = createSlice({
	name: "accountSettings",
	initialState: [] as Project[],
	reducers: {
		addProject: (state, action: PayloadAction<Project>) => {
			const index = state.findIndex((project) => project.id == action.payload.id);
			if (index) {
				state[index] = action.payload
				return
			}
			state.push(action.payload)
		},
		deleteProject: (state, action: PayloadAction<number>) => state.filter((project) => project.id != action.payload),
		clearProjects: () => [],
		createTask: (state, action: PayloadAction<CreateTaskEvent>) => {
			alterProject(state, action, (data) => {
				data.tasks.push({
					archived: false,
					completed: false,
					id: data.taskCount,
					name: action.payload.name,
					description: action.payload.description,
				})
				data.taskCount++;
			});
		},
		editTask: (state, action: PayloadAction<EditTaskEvent>) => {
			const payload = action.payload;
			alterProjectTask(state, action, (task) => {
				const fields: (keyof typeof payload & keyof typeof task)[] = ["name", "description", "completed", "archived", "dueDate", "dueTime"];
				fields.forEach((field) => {
					//@ts-ignore
					task[field] = payload[field]
				});
			});
		},
		deleteTask: (state, action: PayloadAction<DeleteTaskEvent>) => {
			alterProject(state, action, (data) => data.tasks.filter((task) => task.id != action.payload.id));
		},
		deleteLabel: (state, action: PayloadAction<DeleteLabelEvent>) =>
			alterProjectTask(state, action, (task) => task.labels?.filter((label) => label != action.payload.name)),
		addLabel: (state, action: PayloadAction<AddLabelEvent>) =>
			alterProjectTask(state, action, (task) => {
				if (!task.labels) {
					task.labels = [action.payload.name];
					return
				}
				if (task.labels.find((label) => label == action.payload.name) == undefined)
					task.labels.push(action.payload.name);
			}),
	}
})

export const { addProject, deleteProject, clearProjects: clear, createTask, editTask, deleteLabel, addLabel } = projectsSlice.actions;
