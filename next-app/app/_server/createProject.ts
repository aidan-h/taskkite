import { Connection, RowDataPacket } from "mysql2/promise";
import getProject from "./getProject";

const CREATE_PROJECT_STATEMENT =
	"INSERT INTO project (name, owner, id) VALUES (?, ?, ?)";

export default async function createProject(db: Connection, name: string, email: string, id: number) {
	await db.execute<RowDataPacket[]>(CREATE_PROJECT_STATEMENT, [name, email, id]);
	return await getProject(db, id)
}
