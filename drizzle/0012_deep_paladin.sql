CREATE TABLE IF NOT EXISTS "availability" (
	"id" bigint PRIMARY KEY DEFAULT public.id_generator() NOT NULL,
	"business_id" bigint NOT NULL,
	"days" integer[],
	"availability" jsonb[][],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "availability" ADD CONSTRAINT "availability_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
