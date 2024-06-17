ALTER TABLE "events" ALTER COLUMN "from_date" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "to_date" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "sub_events" ALTER COLUMN "event_date" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "sub_events" ALTER COLUMN "event_date" SET NOT NULL;