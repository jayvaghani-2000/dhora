CREATE TABLE IF NOT EXISTS "events" (
	"id" bigint PRIMARY KEY DEFAULT public.id_generator() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"deleted" boolean DEFAULT false,
	"completed" boolean DEFAULT false,
	"single_day_event" boolean DEFAULT false,
	"from_date" timestamp,
	"to_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contracts" ADD COLUMN "event_id" bigint;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contracts" ADD CONSTRAINT "contracts_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
