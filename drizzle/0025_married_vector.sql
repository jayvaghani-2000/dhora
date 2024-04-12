ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";

CREATE UNIQUE INDEX “users_email_unique”
ON users(email, deleted)
WHERE deleted = false;