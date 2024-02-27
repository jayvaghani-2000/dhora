CREATE TABLE IF NOT EXISTS "invoices" (
	"id" bigint PRIMARY KEY DEFAULT public.id_generator() NOT NULL,
	"business_name" text NOT NULL,
	"business_contact" varchar(20) NOT NULL,
	"business_address" text,
	"business_logo" text,
	"customer_name" text NOT NULL,
	"customer_email" text NOT NULL,
	"items" jsonb,
	"tax" integer NOT NULL,
	"total" double precision NOT NULL,
	"business_id" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "emailVerified" TO "email_verified";--> statement-breakpoint
ALTER TABLE "business" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "business" ADD COLUMN "contact" varchar(20);--> statement-breakpoint
ALTER TABLE "business" ADD COLUMN "logo" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_template_id_unique" UNIQUE("template_id");