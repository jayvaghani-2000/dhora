ALTER TABLE "bookings" ADD COLUMN "event_id" bigint;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "sub_event_id" bigint;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "add_on_id" bigint;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "package_id" bigint;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_sub_event_id_sub_events_id_fk" FOREIGN KEY ("sub_event_id") REFERENCES "sub_events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_add_on_id_add_ons_id_fk" FOREIGN KEY ("add_on_id") REFERENCES "add_ons"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
