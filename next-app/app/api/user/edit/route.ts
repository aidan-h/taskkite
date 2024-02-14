import { handleUserPost } from "@/app/_lib/handleUserPost";
import { nameSchema } from "@/app/_lib/data";

const EDIT_USER_STATEMENT = "UPDATE user SET name = ? WHERE email = ?";

export const POST = handleUserPost(nameSchema, async (db, session, data) => {
  await db.execute(EDIT_USER_STATEMENT, [data, session.email]);
  return Response.json(null);
});
