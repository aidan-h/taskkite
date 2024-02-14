import { Connection, RowDataPacket } from "mysql2/promise";

const GET_OWN_PROJECT_STATEMENT =
  "SELECT * FROM project WHERE owner = ?, id = ?";

export async function ownsProject(
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

export async function isMember(
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
export async function isOfProject(
  db: Connection,
  email: string,
  id: number,
): Promise<boolean> {
  return (await ownsProject(db, email, id)) || (await isMember(db, email, id));
}
