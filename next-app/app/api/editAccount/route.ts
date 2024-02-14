import { editUserSchema, nameSchema } from "@/app/_lib/schemas";
import { handleClientPostReq } from "@/app/_server/handleClient";

const EDIT_USER_STATEMENT = "UPDATE user SET name = ? WHERE email = ?";
export const POST = handleClientPostReq(
	editUserSchema,
	async (db, session, req) => {
		const name = req.name.trim();
		nameSchema.parse(name);
		await db.execute(EDIT_USER_STATEMENT, [name, session.email]);
		return Response.json("Updated account");
	},
);
