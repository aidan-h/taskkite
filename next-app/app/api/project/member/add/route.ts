import { handleUserPost } from "@/app/_lib/handleUserPost";
import { ownsProject } from "@/app/_lib/isOfProject";
import { Connection } from "mysql2/promise";
import { z } from "zod";

const ADD_MEMBER_STATEMENT =
  "INSERT INTO member (project_id, email) VALUES (?, ?)";

const schema = z.object({
  email: z.string(),
  id: z.number(),
});

async function addMember(
  db: Connection,
  memberEmail: string,
  projectId: number,
) {
  await db.execute(ADD_MEMBER_STATEMENT, [projectId, memberEmail]);
}

export const POST = handleUserPost(schema, async (db, session, data) => {
  if (!(await ownsProject(db, session.email, data.id)))
    return new Response("don't own project " + data.id, { status: 400 });
  await addMember(db, data.email, data.id);
  return Response.json(null);
});
