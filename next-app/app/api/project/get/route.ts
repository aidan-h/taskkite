import { handleUserPost } from "@/app/_lib/handleUserPost";
import { isOfProject } from "@/app/_lib/isOfProject";
import { Connection, RowDataPacket } from "mysql2/promise";
import { z } from "zod";

interface Project {
  name: string;
  owner: string;
  id: number;
}

const GET_PROJECT_STATEMENT = "SELECT * FROM project WHERE id = ?";
async function getProject(
  db: Connection,
  id: number,
): Promise<Project | undefined> {
  const [rows, _] = await db.execute<RowDataPacket[]>(GET_PROJECT_STATEMENT, [
    id,
  ]);
  return rows[0] as Project | undefined;
}

// right now, any member can edit project name

export const POST = handleUserPost(z.number(), async (db, session, id) => {
  if (!(await isOfProject(db, session.email, id)))
    return new Response("not of project", { status: 400 });
  const project = await getProject(db, id);
  if (project) return Response.json(project);
  return new Response("project doesn't exist", { status: 400 });
});
