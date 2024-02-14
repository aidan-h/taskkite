"use client";
import { signOut } from "next-auth/react";
import {
	SyncRequest,
	ClientEvent,
	AppData,
	Project,
	AffectProject,
} from "./data";

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
	getData("/api/deleteAccount", {}).catch(console.error);
	signOut();
}

export async function syncProject(req: SyncRequest): Promise<ClientEvent[]> {
	return await getData("/api/project/sync", req);
}

export async function getAppData(): Promise<AppData> {
	return await getData("/api/appData", {});
}

export async function getProject(req: AffectProject): Promise<Project> {
	return await getData("/api/project/get", req);
}
