CREATE TABLE IF NOT EXISTS "booking_types" (
	"id" bigint PRIMARY KEY DEFAULT public.id_generator() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"duration" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false,
	"availability_id" bigint NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking_types" ADD CONSTRAINT "booking_types_availability_id_availability_id_fk" FOREIGN KEY ("availability_id") REFERENCES "availability"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
