import { RowDataPacket } from "mysql2";
import { UserSession } from "@/app/_lib/session";
import { Project, SharedProject, UserData } from "@/app/_lib/useUserData";
import { Connection } from "mysql2/promise";
import { handleUserGet } from "@/app/_lib/handleUserPost";

const GET_PROJECTS_STATEMENT = "SELECT id, name FROM project WHERE owner = ?";

async function getProjects(db: Connection, email: string): Promise<Project[]> {
  const [results, _fields] = await db.execute<RowDataPacket[]>(
    GET_PROJECTS_STATEMENT,
    [email],
  );
  return results as Project[];
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
): Promise<SharedProject[]> {
  let projects: SharedProject[] = [];
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

const GET_USER_STATEMENT = "SELECT * FROM user WHERE email = ?";

async function getUser(db: Connection, email: string): Promise<UserData> {
  const [results, _fields] = await db.execute<RowDataPacket[]>(
    GET_USER_STATEMENT,
    [email],
  );
  if (!results[0]) throw "no account found";
  const row = results[0] as { email: string; name: string };
  return {
    email: row.email,
    name: row.name,
    projects: await getProjects(db, email),
    shared_projects: await getSharedProjects(db, email),
  };
}

const CREATE_USER_STATEMENT = "INSERT INTO user VALUES (?, ?)";

async function createUser(
  db: Connection,
  session: UserSession,
): Promise<UserData> {
  await db.execute(CREATE_USER_STATEMENT, [session.email, session.name]);
  return {
    email: session.email,
    name: session.name,
    projects: [],
    shared_projects: [],
  };
}

export const POST = handleUserGet(async (db, session) => {
  try {
    return Response.json(await getUser(db, session.email));
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
