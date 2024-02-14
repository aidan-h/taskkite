import { handleUserPost } from "@/app/_lib/handleUserPost";
import { Connection, RowDataPacket } from "mysql2/promise";
import { z } from "zod";

const GET_OWN_PROJECT_STATEMENT =
  "SELECT * FROM project WHERE owner = ?, id = ?";

async function ownsProject(
  db: Connection,
  email: string,
  id: number,
): Promise<boolean> {
  const [rows, _] = await db.execute<RowDataPacket[]>(
    GET_OWN_PROJECT_STATEMENT,
    [email, id],
  );
  return rows.length > 0;
}

const GET_MEMBER_PROJECT_STATEMENT =
  "SELECT * FROM member WHERE email = ?, project_id = ?";

async function isMember(
  db: Connection,
  email: string,
  id: number,
): Promise<boolean> {
  const [rows, _] = await db.execute<RowDataPacket[]>(
    GET_MEMBER_PROJECT_STATEMENT,
    [email, id],
  );
  return rows.length > 0;
}

//TODO make into one query
async function isOfProject(
  db: Connection,
  email: string,
  id: number,
): Promise<boolean> {
  return (await ownsProject(db, email, id)) || (await isMember(db, email, id));
}

const EDIT_PROJECT_STATEMENT = "UPDATE project SET name = ? WHERE id = ?";
async function editProject(db: Connection, id: number, name: string) {
  await db.execute(EDIT_PROJECT_STATEMENT, [name, id]);
}

// right now, any member can edit project name

export const POST = handleUserPost(
  z.object({ name: z.string(), id: z.number() }),
  async (db, session, data) => {
    if (!isOfProject(db, session.email, data.id))
      return new Response(null, { status: 400 });
    await editProject(db, data.id, data.name);
    return Response.json(null);
  },
);
