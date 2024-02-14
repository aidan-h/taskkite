import {
	CreateTaskEvent,
	DeleteTaskEvent,
	EditTaskEvent,
	SyncRequest,
	syncRequestSchema,
	AddLabelEvent,
	DeleteLabelEvent,
	ProjectEvent,
	ProjectEvents,
	UpdateNameEvent,
} from "@/app/_lib/schemas";
import { handleClientPostReq } from "@/app/_server/handleClient";
import { isOfProject } from "@/app/_server/isOfProject";
import { UserSession } from "@/app/_lib/session";
import { Connection, RowDataPacket } from "mysql2/promise";
import { ServerEventHandlers } from "@/app/_lib/sync";
import getCount from "@/app/_server/getCount";

const CREATE_TASK_STATEMENT =
	"INSERT INTO task (project_id, id, name, description, archived, completed, due_date, due_time) VALUES (?, ?, ?, ?, false, false, ?, ?)";

async function getTaskCount(
	db: Connection,
	projectId: number,
): Promise<number> {
	return await getCount(db, "project", "task_count", "id", projectId);
}

async function getProjectHistoryCount(
	db: Connection,
	projectId: number,
): Promise<number> {
	return await getCount(db, "project", "history_count", "id", projectId);
}

const ADD_LABEL_STATEMENT = `INSERT INTO label (project_id, task_id, name) VALUES (?, ?, ?)`;
async function createTask(
	db: Connection,
	data: CreateTaskEvent,
) {
	const count = await getTaskCount(db, data.projectId);
	await db.execute(CREATE_TASK_STATEMENT, [
		data.projectId,
		count,
		data.name,
		data.description ?? "",
		data.dueDate ?? null,
		data.dueTime ?? null,
	]);
	if (data.labels)
		for (const label of data.labels)
			await db.execute(ADD_LABEL_STATEMENT, [data.projectId, count, label]);
}

const DELETE_LABEL_STATEMENT = `DELETE FROM label WHERE project_id = ? AND task_id = ? AND name = ?`;

async function deleteLabel(
	db: Connection,
	data: DeleteLabelEvent,
) {
	await db.execute(DELETE_LABEL_STATEMENT, [data.projectId, data.id, data.name]);
}

async function addLabel(
	db: Connection,
	data: AddLabelEvent,
) {
	await db.execute(ADD_LABEL_STATEMENT, [data.projectId, data.id, data.name]);
}

const TASK_FIELDS: [keyof EditTaskEvent, string][] = [
	["name", "name"],
	["completed", "completed"],
	["description", "description"],
	["archived", "archived"],
	["dueDate", "due_date"],
	["dueTime", "due_time"],
];
async function editTask(
	db: Connection,
	data: EditTaskEvent,
) {
	let statement = "UPDATE task SET ";
	const fields = TASK_FIELDS.filter(([field]) => data[field] != undefined);
	let values = fields.map(([field]) => data[field]);

	for (let i = 0; i < values.length - 1; i++) {
		const [, dbField] = fields[i];
		statement += dbField + " = ?, ";
	}
	const [, dbField] = fields[fields.length - 1];
	statement += dbField + " = ? WHERE project_id = ? AND id = ?";
	values.push(data.projectId);
	values.push(data.id);

	await db.execute(statement, values);
}

const DELETE_TASK_STATEMENT =
	"DELETE FROM task WHERE project_id = ? AND id = ?";

const DELETE_TASK_LABELS_STATEMENT = "DELETE FROM label WHERE task_id = ?";

async function deleteTask(
	db: Connection,
	data: DeleteTaskEvent,
) {
	await db.execute(DELETE_TASK_STATEMENT, [data.projectId, data.id]);
	await db.execute(DELETE_TASK_LABELS_STATEMENT, [data.id]);
}

const UPDATE_NAME_STATEMENT = "UPDATE project SET name = ? WHERE id = ?";

async function updateName(
	db: Connection,
	data: UpdateNameEvent,
) {
	await db.execute(UPDATE_NAME_STATEMENT, [data.name, data.projectId]);
}

const handlers: ServerEventHandlers<ProjectEvents, Connection, Promise<void>> = {
	createTask: createTask,
	deleteTask: deleteTask,
	deleteLabel: deleteLabel,
	addLabel: addLabel,
	editTask: editTask,
	updateName: updateName,
}

const ADD_PROJECT_HISTORY_STATEMENT =
	"INSERT INTO project_history (project_id, id, event, data) VALUES (?, ?, ?, ?)";

async function addToProjectHistory(
	db: Connection,
	projectId: number,
	event: string,
	data: any,
) {
	const count = await getProjectHistoryCount(db, projectId);
	await db.execute(ADD_PROJECT_HISTORY_STATEMENT, [
		projectId,
		count,
		event,
		JSON.stringify(data),
	]);
}

const GET_PROJECT_HISTORY_STATEMENT =
	"SELECT id, event, data FROM project_history WHERE id > ? AND project_id = ? ORDER BY id";
async function getProjectHistorySince(
	db: Connection,
	projectId: number,
	index: number,
): Promise<ProjectEvent[]> {
	const [rows] = await db.execute<RowDataPacket[]>(
		GET_PROJECT_HISTORY_STATEMENT,
		[index, projectId],
	);
	const data = rows as { id: number; event: string; data: any }[];

	return data.map((d) => {
		return [d.event, d.data] as ProjectEvent;
	});
}

async function handleChanges(
	db: Connection,
	changes: ProjectEvent[],
	projectId: number,
) {
	for (const [event, data] of changes) {
		await db.beginTransaction();
		try {
			const handler = handlers[event];
			if (!handler) throw "invalid event " + event;
			await handler(db, data as any);
			await addToProjectHistory(db, projectId, event, data);
			await db.commit();
		} catch (err) {
			await db.rollback();
			throw err;
		}
	}
}

export const POST = handleClientPostReq<SyncRequest>(
	syncRequestSchema,
	async (db: Connection, session: UserSession, req: SyncRequest) => {
		if (!(await isOfProject(db, session.email, req.projectId)))
			return new Response("not of project", { status: 400 });
		if (req.changes) await handleChanges(db, req.changes, req.projectId);
		return Response.json(
			await getProjectHistorySince(db, req.projectId, req.index),
		);
	},
);
