-- AlterTable
ALTER TABLE "Course" ADD COLUMN "banner" TEXT DEFAULT 'https://gustavopmaiabucket.s3.us-east-1.amazonaws.com/curso1.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjED4aCXVzLWVhc3QtMSJIMEYCIQDOa1CdCf2JUhsHtqrzTCazWgaUUZjuith59BDhihutlQIhAOLj31Zf0JRJTByhTDnnvEx3dH7wMkODSaRiphggezhUKu0CCNf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQAhoMODkyNDQyNTQ0MjQxIgyVKLRBdLm%2BElVdna0qwQK5semVxZEHmzDOp7VJKC0ikIFwZ0RRg2bKZ347b4l1sdzniMkdqwKZmf71uJcKrT0aG3JaDzHiHg6y4HHQktKbSjLStqdE1wPAvqIymjDA9eKpJYdnJd6gXbPrwX4OljHUv3H%2BVzAKjA%2BlhwuZn6xy62pXdxAhL5q%2FCqDv0rVdJPObHLy9KNJwUIfyF5LoonFtuwCqT6zIE9%2FhoibsWzmUoO6oBiRbXzv4%2Bccmtn9G2zxzC%2Bi1qd6NZNS4fqkUeNXJSK6S0XZcrOZrMyXo5hiURdI8k%2F9ATf67CwmBVcG27EvkY1wM0jAx2pMu%2BTVmarz%2BszKYARsKRncIiMaoXOdAcyG3PTyjCrL5JaF6J7jSJXFqYWr86QX1IxZlJSBPzvRJNSQEhzsu95rGp6UNnEhV12BpoVUGaFnBW4jQbExNFvQw%2FM%2B7swY6sgIXl6AF%2Fj5hbHmujE8NOR%2FAJKxdzOYihYpsxPsjxQwELpL1qBHkNeQoJe2ojYa%2Fd67%2F%2BLxjl4JpeZexsSVGc8qQdzE141%2BayWZyEySVqrgk4Q7WjrrZoRe58dFtFGkHa8T%2F%2BrKxDFKuvmQzrDQOyrimrTWW1hKeW0kizraLcKtIvUmxuwHiFAOnbUXhG7wJRCcujpmNNmmeLQ6ucwW7KKemJh0e8fPK%2FKaLPIDkCXqbgu4inpvGhwRAF6dnx5K8yG7nsrc8xOTv3sVhYg59pnJx9yBEZowqWzsFCJOAleskEsImlTKML%2FEvbV4kbt6VfuAxLkVs6yY7YRU9tvyJhjWGYZEFzbMeu0xTHF3gkUkZ3zSqGdXlffnTUqRuHB3EOwo32i%2BO%2BnDieumC%2BoUXsWPcX5Y%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240616T133510Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIA47SNYRBYWNYJKSCG%2F20240616%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=65d4bff971738a52e0eb8e8cf0e8614ad3aa7650fea290fd3efd4c04cd7c3b3c';

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "profile_image" TEXT NOT NULL DEFAULT 'https://gustavopmaiabucket.s3.us-east-1.amazonaws.com/default_pfp.jpg?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjED4aCXVzLWVhc3QtMSJIMEYCIQDOa1CdCf2JUhsHtqrzTCazWgaUUZjuith59BDhihutlQIhAOLj31Zf0JRJTByhTDnnvEx3dH7wMkODSaRiphggezhUKu0CCNf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQAhoMODkyNDQyNTQ0MjQxIgyVKLRBdLm%2BElVdna0qwQK5semVxZEHmzDOp7VJKC0ikIFwZ0RRg2bKZ347b4l1sdzniMkdqwKZmf71uJcKrT0aG3JaDzHiHg6y4HHQktKbSjLStqdE1wPAvqIymjDA9eKpJYdnJd6gXbPrwX4OljHUv3H%2BVzAKjA%2BlhwuZn6xy62pXdxAhL5q%2FCqDv0rVdJPObHLy9KNJwUIfyF5LoonFtuwCqT6zIE9%2FhoibsWzmUoO6oBiRbXzv4%2Bccmtn9G2zxzC%2Bi1qd6NZNS4fqkUeNXJSK6S0XZcrOZrMyXo5hiURdI8k%2F9ATf67CwmBVcG27EvkY1wM0jAx2pMu%2BTVmarz%2BszKYARsKRncIiMaoXOdAcyG3PTyjCrL5JaF6J7jSJXFqYWr86QX1IxZlJSBPzvRJNSQEhzsu95rGp6UNnEhV12BpoVUGaFnBW4jQbExNFvQw%2FM%2B7swY6sgIXl6AF%2Fj5hbHmujE8NOR%2FAJKxdzOYihYpsxPsjxQwELpL1qBHkNeQoJe2ojYa%2Fd67%2F%2BLxjl4JpeZexsSVGc8qQdzE141%2BayWZyEySVqrgk4Q7WjrrZoRe58dFtFGkHa8T%2F%2BrKxDFKuvmQzrDQOyrimrTWW1hKeW0kizraLcKtIvUmxuwHiFAOnbUXhG7wJRCcujpmNNmmeLQ6ucwW7KKemJh0e8fPK%2FKaLPIDkCXqbgu4inpvGhwRAF6dnx5K8yG7nsrc8xOTv3sVhYg59pnJx9yBEZowqWzsFCJOAleskEsImlTKML%2FEvbV4kbt6VfuAxLkVs6yY7YRU9tvyJhjWGYZEFzbMeu0xTHF3gkUkZ3zSqGdXlffnTUqRuHB3EOwo32i%2BO%2BnDieumC%2BoUXsWPcX5Y%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240616T133104Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIA47SNYRBYWNYJKSCG%2F20240616%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=93164b5d66e258d8ad5a1867bf2b64f66bf7e6bc9545175014bcb539beb5f27e',
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
