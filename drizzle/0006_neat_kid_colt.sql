DO $$ BEGIN
 CREATE TYPE "invoiceStatusType" AS ENUM('paid', 'pending', 'draft', 'overdue');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "due_date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "status" "invoiceStatusType" NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "stripe_ref" text;