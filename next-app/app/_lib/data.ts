import { ZodSchema, z } from "zod";

export const nameSchema = z
	.string()
	.min(1, { message: "name can't be empty" })
	.max(20, { message: "name can't be more than 20 characters" })
	.trim();
export const descriptionSchema = z.string().max(200).trim().optional();
export type Description = z.infer<typeof descriptionSchema>

const idSchema = z.number().positive().int()
const boolSchema = z.boolean().optional()

const labelsSchema = z.array(nameSchema).optional()

const taskIdSchema = z.object({
	id: idSchema,
})

export const editProjectSchema = z.object({
	name: nameSchema,
})

const createTaskSchema = z.object({
	name: nameSchema,
	description: descriptionSchema,
	labels: labelsSchema,
})
export type CreateTaskEvent = z.infer<typeof createTaskSchema>
export type EditTaskEvent = z.infer<typeof taskSchema>
export type DeleteTaskEvent = z.infer<typeof taskIdSchema>

export const taskSchema = z.object({
	archived: boolSchema,
	completed: boolSchema,
}).merge(createTaskSchema).merge(taskIdSchema)

export type Task = z.infer<typeof taskSchema>

function createEventSchema<T>(name: string, schema: ZodSchema<T>) {
	return z.tuple([z.literal(name), schema])
}

export const userEventSchema =
	z.union([
		createEventSchema<CreateTaskEvent>("createTask", createTaskSchema),
		createEventSchema<EditTaskEvent>("editTask", taskSchema),
		createEventSchema<DeleteTaskEvent>("deleteTask", taskIdSchema)
	])


export type UserEvent = z.infer<typeof userEventSchema>

export const syncRequestSchema = z.object({
	projectId: idSchema,
	index: idSchema,
	changes: z.array(userEventSchema).optional()
})
export type SyncRequest = z.infer<typeof syncRequestSchema>

