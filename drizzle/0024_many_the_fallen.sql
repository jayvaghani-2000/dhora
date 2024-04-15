ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_email_unique";--> statement-breakpoint
ALTER TABLE "business" ALTER COLUMN "user_id" SET DATA TYPE text;

CREATE UNIQUE INDEX "users_email_unique"
ON users(email, deleted)
WHERE deleted = false;