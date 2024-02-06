DO $$ BEGIN
 CREATE TYPE "businessType" AS ENUM('unknown', 'known', 'popular');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "business" (
	"id" bigint PRIMARY KEY DEFAULT public.id_generator() NOT NULL,
	"type" "businessType"
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "business_id" bigint;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
