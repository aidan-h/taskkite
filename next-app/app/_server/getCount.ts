import { Connection, RowDataPacket } from "mysql2/promise";


export default async function getCount(
	db: Connection,
	table: string,
	column: string,
	keyColumn: string,
	id: number | string,
): Promise<number> {
	console.log("lock");
	await db.query("LOCK TABLES " + table + " WRITE");
	console.log("locked");
	await db.execute(
		"UPDATE " +
		table +
		" SET " +
		column +
		" = " +
		column +
		" + 1 WHERE " +
		keyColumn +
		" = ?",
		[id],
	);
	console.log("updated");
	const [rows] = await db.execute<RowDataPacket[]>(
		"SELECT " + column + " FROM " + table + " WHERE " + keyColumn + " = ?",
		[id],
	);
	console.log("unlocking");
	await db.query("UNLOCK TABLES");
	console.log("unlocked");
	if (rows.length == 0) throw "couldn't find count for " + table + " " + id;
	return rows[0][column];
}
