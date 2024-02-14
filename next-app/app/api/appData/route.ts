import { RowDataPacket } from "mysql2";
import { UserSession } from "@/app/_lib/session";
import { Connection } from "mysql2/promise";
import { handleClientGetReq } from "@/app/_server/handleClient";
import { AppData, ProjectResponse, nameSchema, } from "@/app/_lib/schemas";
import getProject from "@/app/_server/getProject";

const GET_PROJECTS_STATEMENT = "SELECT id FROM project WHERE owner = ?";
async function getProjects(
	db: Connection,
	email: string,
): Promise<number[]> {
	const [results] = await db.execute<RowDataPacket[]>(GET_PROJECTS_STATEMENT, [
		email,
	]);
	const rows = results as { id: number }[];
	return rows.map((row) => row.id);
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

const GET_USER_STATEMENT =
	"SELECT name, email, project_count FROM user WHERE email = ?";

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
	const ids = (await getProjects(db, email)).concat(
		await getSharedProjectsId(db, email),
	);
	let projects: ProjectResponse[] = []
	for (const id of ids) {
		projects.push(await getProject(db, id))

	}
	return {
		email: row.email,
		name: row.name,
		//TODO this is an absolute mess
		projects: {
			count: row.project_count,
			data: projects,
		},
	};
}

const CREATE_USER_STATEMENT = "INSERT INTO user (email, name) VALUES (?, ?)";

async function createUser(
	db: Connection,
	session: UserSession,
): Promise<AppData> {
	await db.execute(CREATE_USER_STATEMENT, [session.email, session.name]);
	let name = session.name.trim();
	const n = nameSchema.safeParse(name);
	if (!n.success) name = "New User";
	return {
		email: session.email,
		name,
		projects: { count: 0, data: [] },
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
