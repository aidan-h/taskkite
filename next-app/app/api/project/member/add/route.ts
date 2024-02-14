import { nameSchema } from "@/app/_lib/data";
import { handleUserPost } from "@/app/_lib/handleUserPost";
import { z } from "zod";

const ADD_MEMBER_STATEMENT =
	"INSERT INTO member VALUES (;"

const schema = z.object({
	name: nameSchema,
	id: z.number(),
});

export const POST = handleUserPost(schema, async (db, session, data) => {
	await db.execute(EDIT_PROJECT_STATEMENT, [data.name, data.id, session.email]);
	return Response.json(null);
});
