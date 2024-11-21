-- CreateTable
CREATE TABLE "_BoughtCourses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_BoughtCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BoughtCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_BoughtCourses_AB_unique" ON "_BoughtCourses"("A", "B");

-- CreateIndex
CREATE INDEX "_BoughtCourses_B_index" ON "_BoughtCourses"("B");
