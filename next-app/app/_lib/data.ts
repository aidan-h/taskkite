import { z } from "zod";

export const nameSchema = z.string().min(1, { message: "name can't be empty" }).max(20, { message: "name can't be more than 20 characters" }).trim();
export const descriptionSchema = z.string().max(200).trim();

export interface EditTaskQuery {
	archived: boolean;
	completed: boolean;
	description: string;
	name: string;
	projectId: number;
	id: number;
}

export interface Task {
	projectId: number;
	name: string;
	id: number;
	description: string;
	archived: boolean;
	completed: boolean;
}
