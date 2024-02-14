import mysql from "mysql2/promise";

export const db = mysql.createPool({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_LOGIN,
	database: process.env.MYSQL_DB,
	waitForConnections: true,
	connectionLimit: 10,
	maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
	idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
	queueLimit: 0,
	enableKeepAlive: true,
	keepAliveInitialDelay: 0,
});
