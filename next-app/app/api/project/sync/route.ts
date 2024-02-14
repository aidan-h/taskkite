import {
	CreateTaskEvent,
	DeleteTaskEvent,
	EditTaskEvent,
	SyncRequest,
	ClientEvent,
	syncRequestSchema,
} from "@/app/_lib/data";
import { handleClientPostReq } from "@/app/_lib/handleClient";
import { isOfProject } from "@/app/_lib/isOfProject";
import { UserSession } from "@/app/_lib/session";
import { Connection, RowDataPacket } from "mysql2/promise";

const CREATE_TASK_STATEMENT =
	"INSERT INTO task (project_id, id, name, description, archived, completed) VALUES (?, ?, ?, ?, false, false)";

async function getCount(
	db: Connection,
	table: string,
	column: string,
	keyColumn: string,
	id: number,
): Promise<number> {
	console.log("lock");
	await db.query("LOCK TABLES " + table + " WRITE")
	console.log("locked");
	await db.execute("UPDATE " + table + " SET " + column + " = " + column + " + 1 WHERE " + keyColumn + " = ?", [id])
	console.log("updated");
	const [rows,] = await db.execute<RowDataPacket[]>("SELECT " + column + " FROM " + table + " WHERE " + keyColumn + " = ?", [id])
	console.log("unlocking");
	await db.query("UNLOCK TABLES")
	console.log("unlocked");
	if (rows.length == 0)
		throw "couldn't find count for " + table + " " + id;
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
		data.description ? data.description : "",
	]);
}

const EDIT_TASK_STATEMENT =
	"UPDATE task SET archived = ?, completed = ?, description = ?, name = ? WHERE project_id = ?, id = ?";

async function editTask(
	db: Connection,
	data: EditTaskEvent,
	projectId: number,
) {
	await db.execute(EDIT_TASK_STATEMENT, [
		data.archived ? data.archived : false,
		data.completed ? data.completed : false,
		data.description ? data.description : "",
		data.name,
		projectId,
		data.id,
	]);
}

const DELETE_TASK_STATEMENT = "DELETE FROM task WHERE project_id = ? AND id = ?";
async function deleteTask(
	db: Connection,
	data: DeleteTaskEvent,
	projectId: number,
) {
	await db.execute(DELETE_TASK_STATEMENT, [projectId, data.id]);
}

const handlers = new Map<
	string,
	(db: Connection, data: any, projectId: number) => Promise<void>
>([
	["createTask", createTask],
	["editTask", editTask],
	["deleteTask", deleteTask],
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
		await db.beginTransaction()
		try {
			const handler = handlers.get(event);
			if (!handler) throw "invalid event " + event;
			await handler(db, data, projectId);
			await addToProjectHistory(db, projectId, event, data);
			await db.commit()
		} catch (err) {
			await db.rollback()
			throw err
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
