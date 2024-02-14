import { handleUserPost } from "@/app/_lib/handleUserPost";
import { z } from "zod";

const DELETE_PROJECT_STATEMENT = "DELETE FROM project WHERE id = ?, owner = ?";

export const POST = handleUserPost(z.number(), async (db, _, data) => {
  await db.execute(DELETE_PROJECT_STATEMENT, [name, data]);
  return Response.json(null);
});
