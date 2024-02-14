import { getDb } from "@/app/_lib/mysql";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/_lib/session";
import { z } from "zod";
import { validateName } from "@/app/_lib/data";
import { error } from "console";
import { RowDataPacket } from "mysql2/promise";

const schema = z.object({ name: z.string() });

export async function POST(req: NextRequest, res: NextResponse) {
	const data = await req.json();
	schema.parse(data);
	const err = validateName(data.name)
	if (err)
		throw error(err)

	const db = await getDb();
	const session = await getSession(req, res);

	console.log("changeSettings", data)
	await db.query<RowDataPacket[]>('UPDATE user SET name=' + db.escape(data.name) + ' WHERE email=' + db.escape(session.email));
	return new Response(null, { status: 200 })
}

