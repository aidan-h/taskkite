import { Connection } from "mysql2/promise";

const CREATE_PROJECT_STATEMENT =
	"INSERT INTO project (name, owner, id) VALUES (?, ?, ?)";

export default async function createProject(db: Connection, name: string, email: string, id: number) {
	const [rows] = await db.execute(CREATE_PROJECT_STATEMENT, [name, email, id]);
	console.log(rows);
}
