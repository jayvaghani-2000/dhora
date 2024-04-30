CREATE TABLE IF NOT EXISTS "add_ons" (
	"id" bigint PRIMARY KEY DEFAULT public.id_generator() NOT NULL,
	"business_id" bigint,
	"add_on_group_id" bigint,
	"name" text,
	"description" text,
	"max_unit" integer,
	"unit_rate" integer,
	"deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_add_on_name" UNIQUE("business_id","name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "add_ons_groups" (
	"id" bigint PRIMARY KEY DEFAULT public.id_generator() NOT NULL,
	"business_id" bigint,
	"name" text,
	"deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_add_on_grouped_name" UNIQUE("business_id","name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "add_ons" ADD CONSTRAINT "add_ons_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "add_ons" ADD CONSTRAINT "add_ons_add_on_group_id_add_ons_groups_id_fk" FOREIGN KEY ("add_on_group_id") REFERENCES "add_ons_groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "add_ons_groups" ADD CONSTRAINT "add_ons_groups_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
