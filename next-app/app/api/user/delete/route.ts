import { getDb } from "@/app/_lib/mysql";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { getSession } from "@/app/_lib/session";
import { Connection } from "mysql2/promise";

const GET_PROJECTS_ID_STATEMENT =
	`SELECT id FROM project WHERE owner = ?`

const DELETE_USER_STATEMENTS = [
	'DELETE FROM user WHERE email = ?',
	'DELETE FROM project WHERE owner = ?',
	'DELETE FROM member WHERE email = ?'
]

const DELETE_PROJECT_STATEMENTS = [
	'DELETE FROM member WHERE project_id = ?',
	'DELETE FROM project WHERE project_id = ?',
	'DELETE FROM task WHERE project_id = ?',
	'DELETE FROM label WHERE project_id = ?',
	'DELETE FROM task_history WHERE project_id = ?'
]

async function getProjectsId(db: Connection, email: string): Promise<number[]> {
	const [rows, _fields] = await db.execute<RowDataPacket[]>(GET_PROJECTS_ID_STATEMENT, [email]);
	return rows.map((row) => row.id);
}

async function deleteUser(db: Connection, email: string) {
	const projects_id = await getProjectsId(db, email);
	for (const statement of DELETE_USER_STATEMENTS)
		await db.execute(statement, [email]);
	console.log("pid", projects_id)
	for (const id of projects_id) {
		console.log("id", id)
		for (const statement of DELETE_PROJECT_STATEMENTS)
			await db.execute(statement, [id]);
	}
}

export async function POST(req: NextRequest, res: NextResponse) {
	const db = await getDb();
	const session = await getSession(req, res);

	try {
		deleteUser(db, session.email);
		return Response.json("Deleted account");
	} catch (err) {
		console.error(err);
		return Response.json("Couldn't delete account", { status: 500 });
	}
}

