"use client";
import { signOut } from "next-auth/react";
import {
	SyncRequest,
	ClientEvent,
	AppData,
	ProjectData,
	AffectProject,
	EditUserRequest,
	CreateProjectResponse,
} from "./data";

async function getData<T, D>(url: string, data: D): Promise<T> {
	const resp = await fetch(url, { body: JSON.stringify(data), method: "POST" });
	const text = await resp.text();
	if (resp.status == 200) return JSON.parse(text) as T;
	throw text;
}

export async function createProject(name: string): Promise<CreateProjectResponse> {
	return await getData("/api/project/create", { name: name });
}

export async function deleteProject(id: number) {
	await getData("/api/project/delete", { projectId: id });
}

export function deleteAccount() {
	getData("/api/deleteAccount", {}).catch(console.error);
	signOut();
}

export async function syncProject(req: SyncRequest): Promise<ClientEvent[]> {
	return await getData("/api/project/sync", req);
}

export async function getAppData(): Promise<AppData> {
	return await getData("/api/appData", {});
}
export async function editUser(req: EditUserRequest) {
	await getData("/api/editAccount", req)
}

export async function getProject(req: AffectProject): Promise<ProjectData> {
	return await getData("/api/project/get", req);
}
