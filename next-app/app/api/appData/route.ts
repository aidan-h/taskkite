import { RowDataPacket } from "mysql2";
import { UserSession } from "@/app/_lib/session";
import { Connection } from "mysql2/promise";
import { handleClientGetReq } from "@/app/_lib/handleClient";
import { AppData, ProjectIdentifier } from "@/app/_lib/data";

const GET_PROJECTS_STATEMENT = "SELECT id, name FROM project WHERE owner = ?";
async function getProjects(
  db: Connection,
  email: string,
): Promise<ProjectIdentifier[]> {
  const [results] = await db.execute<RowDataPacket[]>(GET_PROJECTS_STATEMENT, [
    email,
  ]);
  return results as ProjectIdentifier[];
}

const GET_SHARED_PROJECTS_ID_STATEMENT =
  "SELECT project_id FROM member WHERE email = ?";

async function getSharedProjectsId(
  db: Connection,
  email: string,
): Promise<number[]> {
  const [results, _fields] = await db.execute<RowDataPacket[]>(
    GET_SHARED_PROJECTS_ID_STATEMENT,
    [email],
  );
  return results.map((row) => row.project_id) as number[];
}

const GET_SHARED_PROJECTS_STATEMENT =
  "SELECT name, owner FROM project WHERE id = ?";

async function getSharedProjects(
  db: Connection,
  email: string,
): Promise<ProjectIdentifier[]> {
  let projects: ProjectIdentifier[] = [];
  for (const id of await getSharedProjectsId(db, email)) {
    const [rows, _] = await db.execute<RowDataPacket[]>(
      GET_SHARED_PROJECTS_STATEMENT,
      [id],
    );
    const row = rows[0];
    if (!row) {
      console.warn("couldn't find project with id ", id);
      continue;
    }
    projects.push({
      owner: row.owner,
      name: row.name,
      id: id,
    });
  }

  return projects;
}

const GET_USER_STATEMENT =
  "SELECT (name, email, project_count) FROM user WHERE email = ?";

async function getAppData(db: Connection, email: string): Promise<AppData> {
  const [results, _fields] = await db.execute<RowDataPacket[]>(
    GET_USER_STATEMENT,
    [email],
  );
  if (!results[0]) throw "no account found";
  const row = results[0] as {
    email: string;
    project_count: number;
    name: string;
  };
  return {
    email: row.email,
    name: row.name,
    //TODO this is an absolute mess
    projects: {
      count: row.project_count,
      identifiers: (await getProjects(db, email)).concat(
        await getSharedProjects(db, email),
      ),
    },
  };
}

const CREATE_USER_STATEMENT = "INSERT INTO user VALUES (?, ?)";

async function createUser(
  db: Connection,
  session: UserSession,
): Promise<AppData> {
  await db.execute(CREATE_USER_STATEMENT, [session.email, session.name]);
  return {
    email: session.email,
    name: session.name,
    projects: { count: 0, identifiers: [] },
  };
}

export const POST = handleClientGetReq(async (db, session) => {
  try {
    return Response.json(await getAppData(db, session.email));
  } catch (err) {
    console.error(err);
    try {
      return Response.json(await createUser(db, session));
    } catch (err) {
      console.error(err);
      return new Response("Couldn't create a new user", { status: 500 });
    }
  }
});
