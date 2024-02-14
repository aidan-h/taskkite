import { Connection, RowDataPacket } from "mysql2/promise";
import { Project } from "./useUserData";
import { Task } from "./data";

const GET_PROJECT_STATEMENT = "SELECT * FROM project WHERE id = ?";
async function getProject(
	db: Connection,
	id: number,
): Promise<Project | undefined> {
	const [rows, _] = await db.execute<RowDataPacket[]>(GET_PROJECT_STATEMENT, [
		id,
	]);
	return rows[0] as Project | undefined;
}

const ADD_MEMBER_STATEMENT =
	"INSERT INTO member (project_id, email) VALUES (?, ?)";

async function addMember(
	db: Connection,
	memberEmail: string,
	projectId: number,
) {
	await db.execute(ADD_MEMBER_STATEMENT, [projectId, memberEmail]);
}

const REMOVE_MEMBER_STATEMENT =
	"DELETE FROM member WHERE project_id = ?, email = ?";

async function removeMember(db: Connection, id: number, email: string) {
	await db.execute(REMOVE_MEMBER_STATEMENT, [id, email]);
}

const DELETE_TASK_STATEMENT = "DELETE FROM task WHERE project_id = ?, id = ?";

async function deleteTask(db: Connection, projectId: number, id: number) {
	await db.execute(DELETE_TASK_STATEMENT, [projectId, id]);
}

const EDIT_TASK_STATEMENT =
	"UPDATE task SET archived = ?, completed = ?, description = ?, name = ? WHERE project_id = ?, id = ?";

async function editTask(
	db: Connection,
	archived: boolean,
	completed: boolean,
	description: string,
	name: string,
	projectId: number,
	id: number,
) {
	await db.execute(EDIT_TASK_STATEMENT, [
		archived,
		completed,
		description,
		name,
		projectId,
		id,
	]);
}

