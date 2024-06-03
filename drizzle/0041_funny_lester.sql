ALTER TABLE "bookings_add_ons" DROP CONSTRAINT "bookings_add_ons_booking_id_bookings_id_fk";
--> statement-breakpoint
ALTER TABLE "bookings_packages" DROP CONSTRAINT "bookings_packages_booking_id_bookings_id_fk";
--> statement-breakpoint
ALTER TABLE "bookings_sub_events" DROP CONSTRAINT "bookings_sub_events_booking_id_bookings_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings_add_ons" ADD CONSTRAINT "bookings_add_ons_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings_packages" ADD CONSTRAINT "bookings_packages_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings_sub_events" ADD CONSTRAINT "bookings_sub_events_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
