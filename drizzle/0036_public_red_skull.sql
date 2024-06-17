ALTER TABLE "bookings" DROP CONSTRAINT "bookings_event_id_events_id_fk";
ALTER TABLE "contracts" DROP CONSTRAINT "contracts_event_id_events_id_fk";
ALTER TABLE "sub_events" DROP CONSTRAINT "sub_events_event_id_events_id_fk";
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_event_id_events_id_fk";

ALTER TABLE "bookings" ALTER COLUMN "event_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "contracts" ALTER COLUMN "event_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ratings" ALTER COLUMN "event_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "sub_events" ALTER COLUMN "event_id" SET DATA TYPE text;

UPDATE "bookings" SET "event_id" = CAST("event_id" AS text);
UPDATE "contracts" SET "event_id" = CAST("event_id" AS text);
UPDATE "events" SET "id" = CAST("id" AS text);
UPDATE "ratings" SET "event_id" = CAST("event_id" AS text);
UPDATE "sub_events" SET "event_id" = CAST("event_id" AS text);

ALTER TABLE "bookings"
  ADD CONSTRAINT "bookings_event_id_events_id_fk"
  FOREIGN KEY ("event_id")
  REFERENCES "events" ("id");

ALTER TABLE "contracts"
  ADD CONSTRAINT "contracts_event_id_events_id_fk"
  FOREIGN KEY ("event_id")
  REFERENCES "events" ("id");

ALTER TABLE "sub_events"
  ADD CONSTRAINT "sub_events_event_id_events_id_fk"
  FOREIGN KEY ("event_id")
  REFERENCES "events" ("id");

ALTER TABLE "ratings"
  ADD CONSTRAINT "ratings_event_id_events_id_fk"
  FOREIGN KEY ("event_id")
  REFERENCES "events" ("id");