DO $$ BEGIN
 CREATE TYPE "payViaType" AS ENUM('stripe', 'cash', 'cheque');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "contracts" ADD COLUMN "deleted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "pay_via" "payViaType" DEFAULT 'stripe';