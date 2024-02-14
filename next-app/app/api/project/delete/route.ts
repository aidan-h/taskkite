import { handleUserPost } from "@/app/_lib/handleUserPost";
import { z } from "zod";

const DELETE_PROJECT_STATEMENT = "DELETE FROM project WHERE id = ?, owner = ?";

export const POST = handleUserPost(z.number(), async (db, session, data) => {
  await db.execute(DELETE_PROJECT_STATEMENT, [data, session.email]);
  return Response.json(null);
});
