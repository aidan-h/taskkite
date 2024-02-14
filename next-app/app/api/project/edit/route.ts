import { nameSchema } from "@/app/_lib/data";
import { handleUserPost } from "@/app/_lib/handleUserPost";
import { Connection } from "mysql2/promise";
import { z } from "zod";

const EDIT_PROJECT_STATEMENT =
	"UPDATE project SET name = ? WHERE id = ?, owner = ?";

async function editProject(db: Connection, name: string, id: number, owner: string) {
	await db.execute(EDIT_PROJECT_STATEMENT, [name, id, owner]);
}

const schema = z.object({
	name: nameSchema,
	id: z.number(),
});

export const POST = handleUserPost(schema, async (db, session, data) => {
	await editProject(db, data.name, data.id, session.email)
	return Response.json(null);
});
