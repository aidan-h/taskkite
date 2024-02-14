import { descriptionSchema, nameSchema } from "@/app/_lib/data";
import { handleUserPost } from "@/app/_lib/handleUserPost";
import { isOfProject } from "@/app/_lib/isOfProject";
import { Connection } from "mysql2/promise";
import { z } from "zod";

const EDIT_TASK_STATEMENT =
	"UPDATE task SET archived = ?, completed = ?, description = ?, name = ? WHERE project_id = ?, id = ?";

async function editTask(db: Connection, archived: boolean, completed: boolean, description: string, name: string, projectId: number, id: number) {
	await db.execute(EDIT_TASK_STATEMENT, [archived, completed, description, name, projectId, id]);
}

export const POST = handleUserPost(
	z.object({ archived: z.boolean(), completed: z.boolean(), description: descriptionSchema, name: nameSchema, projectId: z.number(), id: z.number() }),
	async (db, session, data) => {
		if (!(await isOfProject(db, session.email, data.projectId)))
			return new Response("not of project", { status: 400 });
		await editTask(db, data.archived, data.completed, data.description, data.name, data.projectId, data.id);
		return Response.json(null);
	},
);
