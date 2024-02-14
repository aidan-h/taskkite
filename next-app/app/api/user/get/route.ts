import { getDb } from "@/app/_lib/mysql";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { getSession, unauthenticatedResponse } from "@/app/_lib/session";
import { UserData } from "@/app/_lib/useUserData";

export async function POST(req: NextRequest, res: NextResponse) {
	try {
		const db = await getDb();
		const session = await getSession(req, res);

		try {
			const [results, _fields] = await db.query<RowDataPacket[]>('SELECT * FROM user WHERE email=' + db.escape(session.email));
			return Response.json(results[0]);
		} catch (err) {
			try {
				await db.query('INSERT INTO user VALUES (' + db.escape(session.email) +
					',' + db.escape(session.name) + ')')

				const userData: UserData = {
					email: session.email,
					name: session.name
				};
				return Response.json(userData);
			}
			catch (err) {
				console.error(err)
				return new Response("Couldn't create a new user", { status: 500 });
			}
		}
	}
	catch (err) {
		return unauthenticatedResponse
	}
}

