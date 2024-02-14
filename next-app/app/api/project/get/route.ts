import {
  AffectProject,
  Label,
  Project,
  affectProjectSchema,
} from "@/app/_lib/data";
import { handleClientPostReq } from "@/app/_lib/handleClient";
import { isOfProject } from "@/app/_lib/isOfProject";
import { parseSQLBool } from "@/app/_lib/mysql";
import { Connection, RowDataPacket } from "mysql2/promise";

const LOCK_STATEMENT = `LOCK TABLES project READ, task READ`;
const GET_PROJECT_STATEMENT = `SELECT name, owner, task_count, history_count FROM project WHERE id = ?`;
const GET_TASKS_STATEMENT = `SELECT id, name, description, archived, completed FROM task WHERE project_id = ?`;
const GET_LABELS_STATEMENT = `SELECT name FROM label WHERE project_id = ? AND task_id = ?`;

async function getLabels(
  db: Connection,
  projectId: number,
  id: number,
): Promise<Label[]> {
  const [rows] = await db.execute<RowDataPacket[]>(GET_LABELS_STATEMENT, [
    projectId,
    id,
  ]);
  const r = rows as { name: string }[];
  return r.map((row) => row.name);
}

async function getProject(db: Connection, projectId: number): Promise<Project> {
  await db.query(LOCK_STATEMENT);
  const [projectRows] = await db.execute<RowDataPacket[]>(
    GET_PROJECT_STATEMENT,
    [projectId],
  );
  const [rows] = await db.execute<RowDataPacket[]>(GET_TASKS_STATEMENT, [
    projectId,
  ]);
  await db.query("UNLOCK TABLES");

  const projectRow = projectRows[0] as
    | {
        name: string;
        owner: string;
        task_count: number;
        history_count: number;
      }
    | undefined;
  const taskRows = rows as {
    id: number;
    name: string;
    description: string;
    archived: number;
    completed: number;
  }[];

  if (projectRow == undefined) throw "couldn't find project " + projectId;

  let tasks = [];
  for (const row of taskRows) {
    tasks.push({
      name: row.name,
      id: row.id,
      archived: parseSQLBool(row.archived),
      description: row.description,
      completed: parseSQLBool(row.completed),
      //TODO batch requests for performance
      labels: await getLabels(db, projectId, row.id),
    });
  }

  return {
    id: projectId,
    name: projectRow.name,
    historyCount: projectRow.history_count,
    taskCount: projectRow.task_count,
    owner: projectRow.owner,
    tasks: tasks,
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
