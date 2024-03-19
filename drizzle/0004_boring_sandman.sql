ALTER TABLE "invoices" ALTER COLUMN "tax" SET DEFAULT 2;--> statement-breakpoint
ALTER TABLE "business" ADD COLUMN "logo" jsonb;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "business_email" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "business_logo" jsonb;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "customer_contact" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "customer_address" text;