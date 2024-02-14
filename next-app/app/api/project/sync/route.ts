import {
	CreateTaskEvent,
	DeleteTaskEvent,
	EditTaskEvent,
	SyncRequest,
	ClientEvent,
	syncRequestSchema,
	AddLabelEvent,
	DeleteLabelEvent,
} from "@/app/_lib/data";
import { handleClientPostReq } from "@/app/_lib/handleClient";
import { isOfProject } from "@/app/_lib/isOfProject";
import { UserSession } from "@/app/_lib/session";
import { Connection, RowDataPacket } from "mysql2/promise";

const CREATE_TASK_STATEMENT =
	"INSERT INTO task (project_id, id, name, description, archived, completed, due_date, due_time) VALUES (?, ?, ?, ?, false, false, ?, ?)";

async function getCount(
	db: Connection,
	table: string,
	column: string,
	keyColumn: string,
	id: number,
): Promise<number> {
	console.log("lock");
	await db.query("LOCK TABLES " + table + " WRITE");
	console.log("locked");
	await db.execute(
		"UPDATE " +
		table +
		" SET " +
		column +
		" = " +
		column +
		" + 1 WHERE " +
		keyColumn +
		" = ?",
		[id],
	);
	console.log("updated");
	const [rows] = await db.execute<RowDataPacket[]>(
		"SELECT " + column + " FROM " + table + " WHERE " + keyColumn + " = ?",
		[id],
	);
	console.log("unlocking");
	await db.query("UNLOCK TABLES");
	console.log("unlocked");
	if (rows.length == 0) throw "couldn't find count for " + table + " " + id;
	return rows[0][column];
}

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
	projectId: number,
) {
	const count = await getTaskCount(db, projectId);
	await db.execute(CREATE_TASK_STATEMENT, [
		projectId,
		count,
		data.name,
		data.description ?? "", data.dueDate ?? null, data.dueTime ?? null
	]);
	if (data.labels)
		for (const label of data.labels)
			await db.execute(ADD_LABEL_STATEMENT, [projectId, count, label]);
}

const DELETE_LABEL_STATEMENT = `DELETE FROM label WHERE project_id = ? AND task_id = ? AND name = ?`;

async function deleteLabel(
	db: Connection,
	data: DeleteLabelEvent,
	projectId: number,
) {
	await db.execute(DELETE_LABEL_STATEMENT, [projectId, data.id, data.name]);
}

async function addLabel(
	db: Connection,
	data: AddLabelEvent,
	projectId: number,
) {
	await db.execute(ADD_LABEL_STATEMENT, [projectId, data.id, data.name]);
}

const TASK_FIELDS: [keyof EditTaskEvent, string][] = [
	["name", "name"],
	["completed", "completed"],
	["description", "description"],
	["archived", "archived"],
	["dueDate", "due_date"],
	["dueTime", "due_time"]
];
async function editTask(
	db: Connection,
	data: EditTaskEvent,
	projectId: number,
) {
	let statement = "UPDATE task SET ";
	const fields = TASK_FIELDS.filter(([field,]) => data[field] != undefined);
	let values = fields.map(([field,]) => data[field]);

	for (let i = 0; i < values.length - 1; i++) {
		const [, dbField] = fields[i];
		statement += dbField + " = ?, ";
	}
	const [, dbField] = fields[fields.length - 1];
	statement += dbField + " = ? WHERE project_id = ? AND id = ?";
	values.push(projectId);
	values.push(data.id);

	await db.execute(statement, values);
}

const DELETE_TASK_STATEMENT =
	"DELETE FROM task WHERE project_id = ? AND id = ?";

const DELETE_TASK_LABELS_STATEMENT = "DELETE FROM label WHERE task_id = ?";

async function deleteTask(
	db: Connection,
	data: DeleteTaskEvent,
	projectId: number,
) {
	await db.execute(DELETE_TASK_STATEMENT, [projectId, data.id]);
	await db.execute(DELETE_TASK_LABELS_STATEMENT, [data.id]);
}

const handlers = new Map<
	string,
	(db: Connection, data: any, projectId: number) => Promise<void>
>([
	["createTask", createTask],
	["editTask", editTask],
	["deleteTask", deleteTask],
	["deleteLabel", deleteLabel],
	["addLabel", addLabel],
]);

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
): Promise<ClientEvent[]> {
	const [rows] = await db.execute<RowDataPacket[]>(
		GET_PROJECT_HISTORY_STATEMENT,
		[index, projectId],
	);
	const data = rows as { id: number; event: string; data: any }[];

	return data.map((d) => {
		return [d.event, d.data];
	});
}

async function handleChanges(
	db: Connection,
	changes: ClientEvent[],
	projectId: number,
) {
	for (const [event, data] of changes) {
		await db.beginTransaction();
		try {
			const handler = handlers.get(event);
			if (!handler) throw "invalid event " + event;
			await handler(db, data, projectId);
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
