ALTER TABLE "business" ALTER COLUMN "logo" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN IF EXISTS "business_name";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN IF EXISTS "business_contact";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN IF EXISTS "business_address";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN IF EXISTS "business_email";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN IF EXISTS "business_logo";