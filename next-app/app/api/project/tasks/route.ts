import { Task } from "@/app/_lib/data";
import { handleUserPost } from "@/app/_lib/handleUserPost";
import { isOfProject } from "@/app/_lib/isOfProject";
import { Connection, RowDataPacket } from "mysql2/promise";
import { z } from "zod";

const PROJECT_TASKS_STATEMENT =
	"SELECT * FROM task WHERE (project_id = ? and archived = false)";
async function getProjectTasks(
	db: Connection,
	projectId: number,
): Promise<Task[]> {
	const [rows, _] = await db.execute<RowDataPacket[]>(PROJECT_TASKS_STATEMENT, [
		projectId,
	]);
	return rows as Task[];
}

export const POST = handleUserPost(z.object({ id: z.number() }), async (db, session, req) => {
	if (!(await isOfProject(db, session.email, req.id)))
		return new Response("not of project", { status: 400 });
	return Response.json(await getProjectTasks(db, req.id));
});
