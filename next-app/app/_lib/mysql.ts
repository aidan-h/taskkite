import mysql from "mysql2/promise"

let storedDb: mysql.Connection | undefined;
export async function getDb() {
	if (storedDb) return storedDb;
	storedDb = await mysql.createConnection({
		host: process.env.MYSQL_HOST,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_LOGIN,
		database: process.env.MYSQL_DB
	});
	return storedDb
}
