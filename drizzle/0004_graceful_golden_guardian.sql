DO $$ BEGIN
 CREATE TYPE "userType" AS ENUM('regular_user', 'business_user');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "businessType" ADD VALUE 'Event Planner';--> statement-breakpoint
ALTER TYPE "businessType" ADD VALUE 'Venue';--> statement-breakpoint
ALTER TYPE "businessType" ADD VALUE 'Photo & Video';--> statement-breakpoint
ALTER TYPE "businessType" ADD VALUE 'Entertainment';--> statement-breakpoint
ALTER TYPE "businessType" ADD VALUE 'Caterer';--> statement-breakpoint
ALTER TYPE "businessType" ADD VALUE 'Apparel';--> statement-breakpoint
ALTER TYPE "businessType" ADD VALUE 'Health & Beauty';--> statement-breakpoint
ALTER TYPE "businessType" ADD VALUE 'Other';--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_business_id_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_business_id_business_id_fk";
--> statement-breakpoint
ALTER TABLE "business" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "business" ADD COLUMN "user_id" bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user_type" "userType";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "business" ADD CONSTRAINT "business_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "business_id";