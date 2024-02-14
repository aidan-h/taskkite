import { nameSchema } from "@/app/_lib/data";
import { handleUserPost } from "@/app/_lib/handleUserPost";

const CREATE_PROJECT_STATEMENT =
  "INSERT INTO project (name, owner) VALUES (?, ?)";

export const POST = handleUserPost(nameSchema, async (db, _, data) => {
  await db.execute(CREATE_PROJECT_STATEMENT, [name, data]);
  return Response.json(null);
});
