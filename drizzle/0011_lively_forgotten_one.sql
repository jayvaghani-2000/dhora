ALTER TABLE "users" DROP CONSTRAINT "users_stripe_id_unique";--> statement-breakpoint
ALTER TABLE "business" DROP CONSTRAINT "business_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "business" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "business" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "business" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "business" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "first_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "stripe_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "stripe_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "business_id" bigint;--> statement-breakpoint
ALTER TABLE "business" DROP COLUMN IF EXISTS "user_id";