import { descriptionSchema, nameSchema } from "@/app/_lib/data";
import { handleUserPost } from "@/app/_lib/handleUserPost";
import { isOfProject } from "@/app/_lib/isOfProject";
import { Connection } from "mysql2/promise";
import { z } from "zod";

const CREATE_TASK_STATEMENT =
  "INSERT INTO task (project_id, name, description, archived, completed) VALUES (?, ?, ?, false, false)";

async function createTask(
  db: Connection,
  projectId: number,
  name: string,
  description: string,
) {
  await db.execute(CREATE_TASK_STATEMENT, [projectId, name, description]);
}

const schema = z.object({
  id: z.number(),
  name: nameSchema,
  description: descriptionSchema,
});

export const POST = handleUserPost(schema, async (db, session, data) => {
  if (!(await isOfProject(db, session.email, data.id)))
    return new Response("not of project " + data.id, { status: 400 });
  await createTask(db, data.id, data.name, data.description);
  return Response.json(null);
});
