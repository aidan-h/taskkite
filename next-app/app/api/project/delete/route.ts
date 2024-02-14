import { affectProjectSchema } from "@/app/_lib/data";
import { handleClientPostReq } from "@/app/_lib/handleClient";

const DELETE_PROJECT_STATEMENT = "DELETE FROM project WHERE id = ?, owner = ?";

export const POST = handleClientPostReq(
  affectProjectSchema,
  async (db, session, data) => {
    await db.execute(DELETE_PROJECT_STATEMENT, [data, session.email]);
    return Response.json(null);
  },
);
