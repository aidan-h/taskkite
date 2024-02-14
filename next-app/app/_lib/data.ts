import { ZodSchema, z } from "zod";

export const nameSchema = z
	.string()
	.min(1, { message: "name can't be empty" })
	.max(20, { message: "name can't be more than 20 characters" })
	.trim();

export const descriptionSchema = z.string().max(200).trim().optional();
export type Description = z.infer<typeof descriptionSchema>;
export type Label = z.infer<typeof nameSchema>;

const idSchema = z.number().nonnegative().int();
const boolSchema = z.boolean();

const labelsSchema = z.array(nameSchema).optional();

const taskIdSchema = z.object({
	id: idSchema,
});

const affectLabelSchema = z
	.object({
		name: nameSchema,
	})
	.merge(taskIdSchema);

export const affectProjectSchema = z.object({
	projectId: idSchema,
});

export type AffectProject = z.infer<typeof affectProjectSchema>;

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

/**
 * YYYY-MM-DD per MySQL spec
 * see https://stackoverflow.com/questions/2149680/regex-date-format-validation-on-java
*/
export const dueDateSchema = z.string().regex(/\d{4}-\d{2}-\d{2}/).optional()

/**
 * HH-MM-SS per MySQL spec
 * see https://stackoverflow.com/questions/8318236/regex-pattern-for-hhmmss-time-string
*/
export const dueTimeSchema = z.string().regex(/(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)/).optional()

const taskBaseSchema = z.object({
	name: nameSchema,
	dueDate: dueDateSchema,
	dueTime: dueTimeSchema,
	description: descriptionSchema,
});

const taskAfterBaseSchema = z
	.object({
		archived: boolSchema,
		completed: boolSchema,
	})
	.merge(taskBaseSchema);

const createTaskSchema = z
	.object({
		labels: labelsSchema,
	})
	.merge(taskBaseSchema);

export const taskSchema = taskAfterBaseSchema
	.merge(createTaskSchema)
	.merge(taskIdSchema);

const editTaskSchema = taskIdSchema.merge(taskAfterBaseSchema.partial());
export type CreateTaskEvent = z.infer<typeof createTaskSchema>;
export type EditTaskEvent = z.infer<typeof editTaskSchema>;
export type DeleteLabelEvent = z.infer<typeof affectLabelSchema>;
export type AddLabelEvent = DeleteLabelEvent;
export type DeleteTaskEvent = z.infer<typeof taskIdSchema>;
export const editUserSchema = z.object({ name: nameSchema })

export type Task = z.infer<typeof taskSchema>;

function createEventSchema<T>(name: string, schema: ZodSchema<T>) {
	return z.tuple([z.literal(name), schema]);
}

export const userEventSchema = z.union([
	createEventSchema<CreateTaskEvent>("createTask", createTaskSchema),
	createEventSchema<EditTaskEvent>("editTask", editTaskSchema),
	createEventSchema<DeleteTaskEvent>("deleteTask", taskIdSchema),
	createEventSchema<DeleteLabelEvent>("deleteLabel", affectLabelSchema),
	createEventSchema<AddLabelEvent>("addLabel", affectLabelSchema),
]);

export type ClientEvent = z.infer<typeof userEventSchema>;

export const syncRequestSchema = z.object({
	projectId: idSchema,
	index: idSchema,
	changes: z.array(userEventSchema).optional(),
});
export type SyncRequest = z.infer<typeof syncRequestSchema>;
export type EditUserRequest = z.infer<typeof editUserSchema>

export interface ProjectIdentifier {
	id: number;
	owner: string;
	name: string;
}

export interface Project extends ProjectIdentifier {
	tasks: Task[];
	historyCount: number;
	taskCount: number;
}

export interface AppData {
	email: string;
	name: string;
	projects: ProjectIdentifier[];
}
