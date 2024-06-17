ALTER TYPE "assetsType" ADD VALUE 'package_assets';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "package_groups" (
	"id" bigint PRIMARY KEY DEFAULT public.id_generator() NOT NULL,
	"business_id" bigint,
	"name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_grouped_name" UNIQUE("business_id","name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "packages" (
	"id" bigint PRIMARY KEY DEFAULT public.id_generator() NOT NULL,
	"business_id" bigint,
	"package_group_id" bigint,
	"name" text,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_package_name" UNIQUE("business_id","name")
);
--> statement-breakpoint
ALTER TABLE "assets" ADD COLUMN "package_id" bigint;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assets" ADD CONSTRAINT "assets_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "package_groups" ADD CONSTRAINT "package_groups_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "packages" ADD CONSTRAINT "packages_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "packages" ADD CONSTRAINT "packages_package_group_id_package_groups_id_fk" FOREIGN KEY ("package_group_id") REFERENCES "package_groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;






CREATE
OR REPLACE FUNCTION on_update_timestamp() RETURNS trigger AS $$ BEGIN NEW.updated_at = now();
RETURN NEW;
END;
$$ language 'plpgsql';



CREATE TRIGGER users_updated_at BEFORE
UPDATE
    ON users FOR EACH ROW EXECUTE PROCEDURE on_update_timestamp();

CREATE TRIGGER business_updated_at BEFORE
UPDATE
    ON business FOR EACH ROW EXECUTE PROCEDURE on_update_timestamp();


CREATE TRIGGER contracts_updated_at BEFORE
UPDATE
    ON contracts FOR EACH ROW EXECUTE PROCEDURE on_update_timestamp();

CREATE TRIGGER invoices_updated_at BEFORE
UPDATE
    ON invoices FOR EACH ROW EXECUTE PROCEDURE on_update_timestamp();

CREATE TRIGGER availability_updated_at BEFORE
UPDATE
    ON availability FOR EACH ROW EXECUTE PROCEDURE on_update_timestamp();


CREATE TRIGGER booking_types_updated_at BEFORE
UPDATE
    ON booking_types FOR EACH ROW EXECUTE PROCEDURE on_update_timestamp();

CREATE TRIGGER events_updated_at BEFORE
UPDATE
    ON events FOR EACH ROW EXECUTE PROCEDURE on_update_timestamp();


CREATE TRIGGER assets_updated_at BEFORE
UPDATE
    ON assets FOR EACH ROW EXECUTE PROCEDURE on_update_timestamp();


CREATE TRIGGER package_groups_updated_at BEFORE
UPDATE
    ON package_groups FOR EACH ROW EXECUTE PROCEDURE on_update_timestamp();

CREATE TRIGGER packages_updated_at BEFORE
UPDATE
    ON packages FOR EACH ROW EXECUTE PROCEDURE on_update_timestamp();


