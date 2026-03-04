-- CreateTable
CREATE TABLE "Developer" (
    "login" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "avatar_url" TEXT NOT NULL,
    "contributions" INTEGER NOT NULL DEFAULT 0,
    "public_repos" INTEGER NOT NULL DEFAULT 0,
    "total_stars" INTEGER NOT NULL DEFAULT 0,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "district" TEXT NOT NULL DEFAULT 'fullstack',
    "rank" INTEGER,
    "dev_score" REAL NOT NULL DEFAULT 0,
    "visit_count" INTEGER NOT NULL DEFAULT 0,
    "kudos_count" INTEGER NOT NULL DEFAULT 0,
    "claimed" BOOLEAN NOT NULL DEFAULT false,
    "owner_id" TEXT,
    "last_seen" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
