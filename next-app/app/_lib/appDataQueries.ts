import { Connection, RowDataPacket } from "mysql2/promise";
import { Task } from "./data";

const PROJECT_TASKS_STATEMENT =
	"SELECT * FROM task WHERE (project_id = ? and archived = false)";
export async function getProjectTasks(
	db: Connection,
	projectId: number,
): Promise<Task[]> {
	const [rows, _] = await db.execute<RowDataPacket[]>(PROJECT_TASKS_STATEMENT, [
		projectId,
	]);
	return rows as Task[];
}
