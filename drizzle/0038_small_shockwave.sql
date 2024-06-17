ALTER TABLE "booking_types" DROP CONSTRAINT "booking_types_availability_id_availability_id_fk";
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_sub_event_id_sub_events_id_fk";

ALTER TABLE "availability" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "booking_types" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "booking_types" ALTER COLUMN "availability_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "sub_event_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "sub_events" ALTER COLUMN "id" SET DATA TYPE text;


UPDATE "availability" SET "id" = CAST("id" AS text);
UPDATE "booking_types" SET "id" = CAST("id" AS text);
UPDATE "booking_types" SET "availability_id" = CAST("availability_id" AS text);
UPDATE "bookings" SET "sub_event_id" = CAST("sub_event_id" AS text);
UPDATE "sub_events" SET "id" = CAST("id" AS text);


ALTER TABLE "booking_types"
  ADD CONSTRAINT "booking_types_availability_id_availability_id_fk"
  FOREIGN KEY ("availability_id")
  REFERENCES "availability" ("id");

ALTER TABLE "bookings"
  ADD CONSTRAINT "bookings_sub_event_id_sub_events_id_fk"
  FOREIGN KEY ("sub_event_id")
  REFERENCES "sub_events" ("id");