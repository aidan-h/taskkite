import { affectMemberSchema } from "@/app/_lib/schemas";
import { handleClientPostReq } from "@/app/_server/handleClient";
import { ownsProject } from "@/app/_server/isOfProject";
import { Connection } from "mysql2/promise";

const REMOVE_MEMBER_STATEMENT =
	"DELETE FROM member WHERE project_id = ?, email = ?";

async function removeMember(db: Connection, id: number, email: string) {
	await db.execute(REMOVE_MEMBER_STATEMENT, [id, email]);
}

export const POST = handleClientPostReq(
	affectMemberSchema,
	async (db, session, data) => {
		if (!(await ownsProject(db, session.email, data.projectId)))
			return Response.json("doesn't own project", { status: 400 });
		await removeMember(db, data.projectId, data.memberEmail);
		return Response.json(null);
	},
);
