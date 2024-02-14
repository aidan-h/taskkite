import { RowDataPacket } from "mysql2";
import { Connection } from "mysql2/promise";
import { handleClientGetReq } from "@/app/_lib/handleClient";

const GET_PROJECTS_ID_STATEMENT = `SELECT id FROM project WHERE owner = ?`;

const DELETE_USER_STATEMENTS = [
  "DELETE FROM user WHERE email = ?",
  "DELETE FROM project WHERE owner = ?",
  "DELETE FROM member WHERE email = ?",
];

const DELETE_PROJECT_STATEMENTS = [
  "DELETE FROM member WHERE project_id = ?",
  "DELETE FROM project WHERE project_id = ?",
  "DELETE FROM task WHERE project_id = ?",
  "DELETE FROM label WHERE project_id = ?",
  "DELETE FROM task_history WHERE project_id = ?",
];

async function getProjectsId(db: Connection, email: string): Promise<number[]> {
  const [rows, _fields] = await db.execute<RowDataPacket[]>(
    GET_PROJECTS_ID_STATEMENT,
    [email],
  );
  return rows.map((row) => row.id);
}

async function deleteUser(db: Connection, email: string) {
  const projects_id = await getProjectsId(db, email);
  for (const statement of DELETE_USER_STATEMENTS)
    await db.execute(statement, [email]);
  console.log("pid", projects_id);
  for (const id of projects_id) {
    console.log("id", id);
    for (const statement of DELETE_PROJECT_STATEMENTS)
      await db.execute(statement, [id]);
  }
}

export const POST = handleClientGetReq(async (db, session) => {
  await deleteUser(db, session.email);
  return Response.json("Deleted account");
});
