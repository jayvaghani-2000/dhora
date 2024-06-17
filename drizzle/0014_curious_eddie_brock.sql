ALTER TABLE "booking_types" ADD COLUMN "business_id" bigint NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking_types" ADD CONSTRAINT "booking_types_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
