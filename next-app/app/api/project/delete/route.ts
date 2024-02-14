import { affectProjectSchema } from "@/app/_lib/data";
import { handleClientPostReq } from "@/app/_lib/handleClient";

const DELETE_PROJECT_STATEMENT = "DELETE FROM project WHERE id = ? AND owner = ?";
const DELETE_TASK_STATEMENT = "DELETE FROM task WHERE project_id = ?";
const DELETE_LABEL_STATEMENT = "DELETE FROM label WHERE project_id = ?";
const DELETE_PROJECT_HISTORY_STATEMENT = "DELETE FROM project_history WHERE project_id = ?";
const DELETE_MEMBER_STATEMENT = "DELETE FROM member WHERE project_id = ?";
const DELETE_TASK_HISTORY_STATEMENT = "DELETE FROM task_history WHERE project_id = ?";


export const POST = handleClientPostReq(
	affectProjectSchema,
	async (db, session, data) => {
		await db.beginTransaction()
		try {
			await db.execute(DELETE_PROJECT_STATEMENT, [data.projectId, session.email]);
			await db.execute(DELETE_PROJECT_HISTORY_STATEMENT, [data.projectId]);
			await db.execute(DELETE_LABEL_STATEMENT, [data.projectId]);
			await db.execute(DELETE_MEMBER_STATEMENT, [data.projectId]);
			await db.execute(DELETE_TASK_STATEMENT, [data.projectId]);
			await db.execute(DELETE_TASK_HISTORY_STATEMENT, [data.projectId]);
			await db.commit()
		} catch (err) {
			await db.rollback()
			throw err
		}
		return Response.json(null);
	},
);
