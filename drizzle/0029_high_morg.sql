CREATE TABLE IF NOT EXISTS "sub_events" (
	"id" bigint PRIMARY KEY DEFAULT public.id_generator() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"event_date" timestamp,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"location" text,
	"event_id" bigint,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sub_events" ADD CONSTRAINT "sub_events_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TRIGGER sub_events_updated_at BEFORE
UPDATE
    ON sub_events FOR EACH ROW EXECUTE PROCEDURE on_update_timestamp();
