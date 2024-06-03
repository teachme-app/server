-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "birth_date" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "adress" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "graduation" TEXT
);
INSERT INTO "new_User" ("adress", "birth_date", "document", "email", "graduation", "id", "name", "password_hash", "phone", "role") SELECT "adress", "birth_date", "document", "email", "graduation", "id", "name", "password_hash", "phone", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check("User");
PRAGMA foreign_keys=ON;
