import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

// const adapter = new PrismaMariaDb({
//   host: "localhost",
//   port: 3306,
//   connectionLimit: 5,
// });

const adapter = new PrismaMariaDb({
  connectionLimit: 5,
  database: "db",
  host: "db",
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USER,
});

const prisma = new PrismaClient({
  adapter,
  log: ["query", "info", "warn", "error"],
});

export default prisma;
