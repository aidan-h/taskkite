import { createTaskSchema } from "@/app/_lib/data";
import { handleUserPost } from "@/app/_lib/handleUserPost";
import { isOfProject } from "@/app/_lib/isOfProject";
import { Connection } from "mysql2/promise";

const CREATE_TASK_STATEMENT =
	"INSERT INTO task (project_id, name, description, archived, completed) VALUES (?, ?, ?, false, false)";

async function createTask(
	db: Connection,
	projectId: number,
	name: string,
	description: string,
) {
	await db.execute(CREATE_TASK_STATEMENT, [projectId, name, description]);
}

export const POST = handleUserPost(createTaskSchema, async (db, session, data) => {
	if (!(await isOfProject(db, session.email, data.id)))
		return new Response("not of project " + data.id, { status: 400 });
	await createTask(db, data.id, data.name, data.description);
	return Response.json(null);
});
