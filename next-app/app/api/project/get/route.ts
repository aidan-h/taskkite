import { AffectProject, Project, affectProjectSchema } from "@/app/_lib/data";
import { handleClientPostReq } from "@/app/_lib/handleClient";
import { isOfProject } from "@/app/_lib/isOfProject";
import { Connection, RowDataPacket } from "mysql2/promise";

const LOCK_STATEMENT = `LOCK TABLES project READ, task READ`;
const GET_PROJECT_STATEMENT = `SELECT name, owner, task_count, history_count FROM project WHERE id = ?`;
const GET_TASKS_STATEMENT = `SELECT id, name, description, archived, completed FROM task WHERE project_id = ?`;

async function getProject(db: Connection, projectId: number): Promise<Project> {
	await db.query(LOCK_STATEMENT)
	const [projectRows,] = await db.execute<RowDataPacket[]>(GET_PROJECT_STATEMENT, [projectId])
	const [rows,] = await db.execute<RowDataPacket[]>(GET_TASKS_STATEMENT, [projectId])
	await db.query("UNLOCK TABLES")

	const projectRow = projectRows[0] as
		| {
			name: string;
			owner: string;
			task_count: number;
			history_count: number;
		}
		| undefined;
	const taskRows = rows as {
		id: number;
		name: string;
		description: string;
		archived: boolean;
		completed: boolean;
	}[];
	if (projectRow == undefined) throw "couldn't find project " + projectId;
	return {
		id: projectId,
		name: projectRow.name,
		historyCount: projectRow.history_count,
		taskCount: projectRow.task_count,
		owner: projectRow.owner,
		tasks: taskRows.map((row) => {
			return {
				name: row.name,
				id: row.id,
				archived: row.archived,
				description: row.description,
				completed: row.completed,
			};
		}),
	};
}

export const POST = handleClientPostReq<AffectProject>(
	affectProjectSchema,
	async (db, session, req) => {
		if (!(await isOfProject(db, session.email, req.projectId)))
			return new Response("not of project", { status: 400 });
		return Response.json(await getProject(db, req.projectId));
	},
);
