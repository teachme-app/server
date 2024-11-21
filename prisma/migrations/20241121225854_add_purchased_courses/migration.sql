/*
  Warnings:

  - You are about to drop the `_BoughtCourses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_BoughtCourses";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_PurchasedCourses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PurchasedCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PurchasedCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_PurchasedCourses_AB_unique" ON "_PurchasedCourses"("A", "B");

-- CreateIndex
CREATE INDEX "_PurchasedCourses_B_index" ON "_PurchasedCourses"("B");
