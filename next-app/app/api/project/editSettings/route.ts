import { editProjectSchema } from "@/app/_lib/schemas";
import { handleClientPostReq } from "@/app/_server/handleClient";
import { Connection } from "mysql2/promise";

const EDIT_PROJECT_STATEMENT =
	"UPDATE project SET name = ? WHERE id = ?, owner = ?";

async function editProject(
	db: Connection,
	name: string,
	id: number,
	owner: string,
) {
	await db.execute(EDIT_PROJECT_STATEMENT, [name, id, owner]);
}

export const POST = handleClientPostReq(
	editProjectSchema,
	async (db, session, data) => {
		await editProject(db, data.name, data.projectId, session.email);
		return Response.json({});
	},
);
