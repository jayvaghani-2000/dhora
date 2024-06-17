DO $$ BEGIN
 CREATE TYPE "depositType" AS ENUM('fixed', 'percentage');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "deposit_type" "depositType";--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "deposit" double precision;