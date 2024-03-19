ALTER TABLE "invoices" ALTER COLUMN "tax" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "platform_fee" integer DEFAULT 2 NOT NULL;