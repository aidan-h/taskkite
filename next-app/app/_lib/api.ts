import { Task } from "./data";
import { SharedProject } from "./useUserData";

export async function getData<T, D>(url: string, data: D): Promise<T> {
	const resp = await fetch(url, { body: JSON.stringify(data), method: "POST" });
	const text = await resp.text();
	if (resp.status == 200) return JSON.parse(text) as T;
	throw text;
}

export async function getProject(id: number): Promise<SharedProject> {
	return await getData("/api/project/get", { id: id });
}

export async function getProjectTasks(id: number): Promise<Task[]> {
	return await getData("/api/project/tasks", { id: id });
}

export async function createProjectAPI(name: string) {
	await getData("/api/project/create", { name: name })
}
