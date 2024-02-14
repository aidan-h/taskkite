import { nameSchema } from "@/app/_lib/data";
import { handleUserPost } from "@/app/_lib/handleUserPost";
import { Connection } from "mysql2/promise";

const CREATE_PROJECT_STATEMENT =
	"INSERT INTO project (name, owner) VALUES (?, ?)";

async function createProject(db: Connection, name: string, email: string) {

	await db.execute(CREATE_PROJECT_STATEMENT, [name, email]);
}
export const POST = handleUserPost(nameSchema, async (db, session, data) => {
	await createProject(db, data, session.email)
	return Response.json(null);
});
