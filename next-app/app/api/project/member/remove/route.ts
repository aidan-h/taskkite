import { handleUserPost } from "@/app/_lib/handleUserPost";
import { ownsProject } from "@/app/_lib/isOfProject";
import { Connection } from "mysql2/promise";
import { z } from "zod";

const REMOVE_MEMBER_STATEMENT =
  "DELETE FROM member WHERE project_id = ?, email = ?";

async function removeMember(db: Connection, id: number, email: string) {
  await db.execute(REMOVE_MEMBER_STATEMENT, [id, email]);
}

export const POST = handleUserPost(
  z.object({ id: z.number(), email: z.string() }),
  async (db, session, data) => {
    if (!(await ownsProject(db, session.email, data.id)))
      return Response.json("doesn't own project", { status: 400 });
    await removeMember(db, data.id, data.email);
    return Response.json(null);
  },
);
