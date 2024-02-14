"use client";
import { signOut } from "next-auth/react";
import { SyncRequest, Task, UserEvent } from "./data";

async function getData<T, D>(url: string, data: D): Promise<T> {
	const resp = await fetch(url, { body: JSON.stringify(data), method: "POST" });
	const text = await resp.text();
	if (resp.status == 200) return JSON.parse(text) as T;
	throw text;
}

export async function createProject(name: string) {
	await getData("/api/project/create", { name: name });
}

export function deleteAccount() {
	fetch("/api/user/delete", { method: "POST" }).catch(console.error);
	signOut();
}

export interface Project {
	id: number;
	owner: string;
	name: string;
	tasks: Task[];
}

export interface AppData {
	email: string;
	name: string;
	projects: Project[];
}

export async function syncAppData(req: SyncRequest): Promise<UserEvent[]> {
	return await getData("/api/sync", req);
}

export async function getAppData(): Promise<AppData> {
	return await getData("/api/appData", {});
}
