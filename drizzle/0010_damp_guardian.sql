ALTER TABLE "users" ADD COLUMN "stripe_id" varchar(256);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_stripe_id_unique" UNIQUE("stripe_id");