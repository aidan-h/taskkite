import { AffectProject, Project, affectProjectSchema } from "@/app/_lib/data";
import { handleClientPostReq } from "@/app/_lib/handleClient";
import { isOfProject } from "@/app/_lib/isOfProject";
import { Connection, RowDataPacket } from "mysql2/promise";

const GET_PROJECT_STATEMENTS = `
SELECT name, owner, task_count, history_count FROM project WHERE id = ?;
SELECT id, name, description, archived, completed FROM task WHERE project_id = ?;
`;

async function getProject(db: Connection, projectId: number): Promise<Project> {
  const [rows] = await db.execute<RowDataPacket[][]>(GET_PROJECT_STATEMENTS, [
    projectId,
    projectId,
  ]);
  const projectRow = rows[0][0] as
    | {
        name: string;
        owner: string;
        task_count: number;
        history_count: number;
      }
    | undefined;
  const taskRows = rows[1] as {
    id: number;
    name: string;
    description: string;
    archived: boolean;
    completed: boolean;
  }[];
  if (projectRow == undefined) throw "couldn't find project " + projectId;
  return {
    id: projectId,
    name: projectRow.name,
    historyCount: projectRow.history_count,
    taskCount: projectRow.task_count,
    owner: projectRow.owner,
    tasks: taskRows.map((row) => {
      return {
        name: row.name,
        id: row.id,
        archived: row.archived,
        description: row.description,
        completed: row.completed,
      };
    }),
  };
}

export const POST = handleClientPostReq<AffectProject>(
  affectProjectSchema,
  async (db, session, req) => {
    if (!(await isOfProject(db, session.email, req.projectId)))
      return new Response("not of project", { status: 400 });
    return Response.json(await getProject(db, req.projectId));
  },
);
