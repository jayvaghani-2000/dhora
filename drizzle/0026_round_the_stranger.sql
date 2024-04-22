DO $$ BEGIN
 CREATE TYPE "packageUnitType" AS ENUM('days', 'hours', 'peoples');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "fixed_priced" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "unit" "packageUnitType";--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "min_unit" integer;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "max_unit" integer;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "unit_rate" integer;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "deleted" boolean DEFAULT false;
