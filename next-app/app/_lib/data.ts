import { ZodSchema, z } from "zod";

function createEventSchema<T>(name: string, schema: ZodSchema<T>) {
	return z.tuple([z.literal(name), schema]);
}
export const nameSchema = z
	.string()
	.min(1, { message: "name can't be empty" })
	.max(20, { message: "name can't be more than 20 characters" })
	.trim();

export const descriptionSchema = z.string().max(200).trim().optional();

/**
 * YYYY-MM-DD per MySQL spec
 * see https://stackoverflow.com/questions/2149680/regex-date-format-validation-on-java
 */
export const dueDateSchema = z
	.string()
	.regex(/\d{4}-\d{2}-\d{2}/)
	.optional();

/**
 * HH-MM-SS per MySQL spec
 * see https://stackoverflow.com/questions/8318236/regex-pattern-for-hhmmss-time-string
 */
export const dueTimeSchema = z
	.string()
	.regex(/(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)/)
	.optional();

const taskBaseSchema = z.object({
	name: nameSchema,
	dueDate: dueDateSchema,
	dueTime: dueTimeSchema,
	description: descriptionSchema,
});
const labelsSchema = z.array(nameSchema).optional();

const taskAfterBaseSchema = z
	.object({
		archived: z.boolean(),
		completed: z.boolean(),
	})
	.merge(taskBaseSchema);

const idSchema = z.number().nonnegative().int();
export const affectProjectSchema = z.object({
	projectId: idSchema,
});
export type AffectProject = z.infer<typeof affectProjectSchema>;

const taskAndLabelsSchema = z
	.object({
		labels: labelsSchema,
	})
	.merge(taskBaseSchema);

const createTaskSchema = taskAndLabelsSchema.merge(affectProjectSchema);

const taskIdSchema = z.object({
	id: idSchema,
});

export type Label = z.infer<typeof nameSchema>;
const affectTaskSchema = taskIdSchema.merge(affectProjectSchema);
const affectLabelSchema = z
	.object({
		name: nameSchema,
	})
	.merge(affectTaskSchema);

export const taskSchema = taskAfterBaseSchema
	.merge(taskAndLabelsSchema)
	.merge(taskIdSchema);
export type Task = z.infer<typeof taskSchema>;
const editTaskSchema = taskIdSchema
	.merge(taskAfterBaseSchema)
	.merge(affectProjectSchema);
export type CreateTaskEvent = z.infer<typeof createTaskSchema>;
export type EditTaskEvent = z.infer<typeof editTaskSchema>;
export type DeleteLabelEvent = z.infer<typeof affectLabelSchema>;
export type AddLabelEvent = DeleteLabelEvent;
export type DeleteTaskEvent = z.infer<typeof affectTaskSchema>;
export type CreateProjectEvent = z.infer<typeof nameSchema>

export const userEventSchema = z.union([
	createEventSchema<CreateTaskEvent>("createTask", createTaskSchema),
	createEventSchema<EditTaskEvent>("editTask", editTaskSchema),
	createEventSchema<DeleteTaskEvent>("deleteTask", affectTaskSchema),
	createEventSchema<DeleteLabelEvent>("deleteLabel", affectLabelSchema),
	createEventSchema<AddLabelEvent>("addLabel", affectLabelSchema),
	createEventSchema<CreateProjectEvent>("createProject", nameSchema),
]);

export type ClientEvent = z.infer<typeof userEventSchema>;

export const syncRequestSchema = z.object({
	projectId: idSchema,
	index: idSchema,
	changes: z.array(userEventSchema).optional(),
});
export type SyncRequest = z.infer<typeof syncRequestSchema>;
export const editUserSchema = z.object({ name: nameSchema });
export type EditUserRequest = z.infer<typeof editUserSchema>;

export const affectMemberSchema = z
	.object({
		memberEmail: z.string(),
	})
	.merge(affectProjectSchema);

export const editProjectSchema = z
	.object({
		name: nameSchema,
	})
	.merge(affectProjectSchema);

export interface ProjectIdentifier {
	id: number;
	owner: string;
}

export interface ProjectData {
	name: string;
	tasks: Task[];
	historyCount: number;
	taskCount: number;
}

export type AccountSettings = {
	email: string;
	name: string;
};
export interface CreateProjectResponse {
	id: number;
}

export type AppData = AccountSettings & {
	projects: {
		count: number;
		data: (ProjectIdentifier & ProjectData)[];
	};
};
