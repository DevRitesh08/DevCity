// ─── Prisma Client Singleton ───────────────────────────────────
// Prisma 7 requires a driver adapter for runtime connections.
// We use @prisma/adapter-libsql with @libsql/client (pure JS, no
// native build required) for local SQLite storage.

import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  // Resolve DB path. DATABASE_URL should be "file:./prisma/dev.db"
  // or an absolute path for libsql local files.
  const rawUrl =
    process.env.DATABASE_URL ??
    `file:${path.resolve(process.cwd(), "prisma", "dev.db")}`;

  // @libsql/client expects "file:/absolute/path" for local SQLite
  const url = rawUrl.startsWith("file:./")
    ? `file:${path.resolve(process.cwd(), rawUrl.slice(7))}`
    : rawUrl;

  const adapter = new PrismaLibSql({ url });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
