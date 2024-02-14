import { handleUserPost } from "@/app/_lib/handleUserPost";
import { isOfProject } from "@/app/_lib/isOfProject";
import { SharedProject } from "@/app/_lib/useUserData";
import { Connection, RowDataPacket } from "mysql2/promise";
import { z } from "zod";

const GET_PROJECT_STATEMENT = "SELECT * FROM project WHERE id = ?";
async function getProject(
	db: Connection,
	id: number,
): Promise<SharedProject | undefined> {
	const [rows, _] = await db.execute<RowDataPacket[]>(GET_PROJECT_STATEMENT, [
		id,
	]);
	return rows[0] as SharedProject | undefined;
}

export const POST = handleUserPost(z.object({ id: z.number() }), async (db, session, id) => {
	if (!(await isOfProject(db, session.email, id.id)))
		return new Response("not of project", { status: 400 });
	const project = await getProject(db, d.id);
	if (project) return Response.json(project);
	return new Response("project doesn't exist", { status: 400 });
});
