import { getDb } from "@/app/_lib/mysql";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { getSession, unauthenticatedResponse } from "@/app/_lib/session";

export async function POST(req: NextRequest, res: NextResponse) {
	const db = await getDb();
	const session = await getSession(req, res);
	if (!session)
		return unauthenticatedResponse

	try {
		await db.query<RowDataPacket[]>('DELETE * FROM user WHERE email=' + db.escape(session.email));
		return new Response(null, { status: 200 });
	} catch (err) {
		return Response.error();
	}
}

