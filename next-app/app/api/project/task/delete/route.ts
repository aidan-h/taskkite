import { handleUserPost } from "@/app/_lib/handleUserPost";
import { isOfProject } from "@/app/_lib/isOfProject";
import { Connection } from "mysql2/promise";
import { z } from "zod";

const DELETE_TASK_STATEMENT = "DELETE FROM task WHERE project_id = ?, id = ?";

async function deleteTask(db: Connection, projectId: number, id: number) {
  await db.execute(DELETE_TASK_STATEMENT, [projectId, id]);
}

export const POST = handleUserPost(
  z.object({ projectId: z.number(), id: z.number() }),
  async (db, session, data) => {
    if (!(await isOfProject(db, session.email, data.projectId)))
      return new Response("not of project", { status: 400 });
    await deleteTask(db, data.projectId, data.id);
    return Response.json(null);
  },
);
