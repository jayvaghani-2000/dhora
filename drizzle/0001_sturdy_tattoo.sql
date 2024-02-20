CREATE TABLE IF NOT EXISTS "contracts" (
	"id" bigint PRIMARY KEY DEFAULT public.id_generator() NOT NULL,
	"template_id" integer NOT NULL,
	"name" text DEFAULT 'New Contract',
	"business_id" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contracts" ADD CONSTRAINT "contracts_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
