CREATE TABLE IF NOT EXISTS "bookings_add_ons" (
	"booking_id" text,
	"add_on_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bookings_packages" (
	"booking_id" text,
	"package_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bookings_sub_events" (
	"booking_id" text,
	"sub_event_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_sub_event_id_sub_events_id_fk";
--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_add_on_id_add_ons_id_fk";
--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_package_id_packages_id_fk";
--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN IF EXISTS "sub_event_id";--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN IF EXISTS "add_on_id";--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN IF EXISTS "package_id";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings_add_ons" ADD CONSTRAINT "bookings_add_ons_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings_add_ons" ADD CONSTRAINT "bookings_add_ons_add_on_id_add_ons_id_fk" FOREIGN KEY ("add_on_id") REFERENCES "add_ons"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings_packages" ADD CONSTRAINT "bookings_packages_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings_packages" ADD CONSTRAINT "bookings_packages_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings_sub_events" ADD CONSTRAINT "bookings_sub_events_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings_sub_events" ADD CONSTRAINT "bookings_sub_events_sub_event_id_sub_events_id_fk" FOREIGN KEY ("sub_event_id") REFERENCES "sub_events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;


