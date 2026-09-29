import sql from "mssql";

let pool: sql.ConnectionPool | undefined;

export function sqlConfigured() {
  return Boolean(
    process.env.SQL_SERVER &&
    process.env.SQL_DATABASE &&
    process.env.SQL_USER &&
    process.env.SQL_PASSWORD
  );
}

export async function getPool() {
  if (!sqlConfigured()) {
    throw new Error("SQL Server is not configured.");
  }
  if (pool?.connected) return pool;

  pool = await new sql.ConnectionPool({
    server: process.env.SQL_SERVER!,
    database: process.env.SQL_DATABASE!,
    user: process.env.SQL_USER!,
    password: process.env.SQL_PASSWORD!,
    options: {
      encrypt: process.env.SQL_ENCRYPT !== "false",
      trustServerCertificate: false
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
  }).connect();

  return pool;
}

export { sql };
