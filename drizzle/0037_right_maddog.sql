
ALTER TABLE "add_ons" DROP CONSTRAINT "add_ons_business_id_business_id_fk";
ALTER TABLE "add_ons_groups" DROP CONSTRAINT "add_ons_groups_business_id_business_id_fk";
ALTER TABLE "assets" DROP CONSTRAINT "assets_business_id_business_id_fk";
ALTER TABLE "availability" DROP CONSTRAINT "availability_business_id_business_id_fk";
ALTER TABLE "booking_types" DROP CONSTRAINT "booking_types_business_id_business_id_fk";
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_business_id_business_id_fk";
ALTER TABLE "packages" DROP CONSTRAINT "packages_business_id_business_id_fk";
ALTER TABLE "contracts" DROP CONSTRAINT "contracts_business_id_business_id_fk";
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_business_id_business_id_fk";
ALTER TABLE "package_groups" DROP CONSTRAINT "package_groups_business_id_business_id_fk";
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_business_id_business_id_fk";



ALTER TABLE "add_ons" ALTER COLUMN "business_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "add_ons_groups" ALTER COLUMN "business_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "assets" ALTER COLUMN "business_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "availability" ALTER COLUMN "business_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "booking_types" ALTER COLUMN "business_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "business_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "business" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "contracts" ALTER COLUMN "business_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "contracts" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "business_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "package_groups" ALTER COLUMN "business_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "packages" ALTER COLUMN "business_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ratings" ALTER COLUMN "business_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "business_id" SET DATA TYPE text;



UPDATE "add_ons" SET "business_id" = CAST("business_id" AS text);
UPDATE "add_ons_groups" SET "business_id" = CAST("business_id" AS text);
UPDATE "assets" SET "business_id" = CAST("business_id" AS text);
UPDATE "availability" SET "business_id" = CAST("business_id" AS text);
UPDATE "booking_types" SET "business_id" = CAST("business_id" AS text);
UPDATE "bookings" SET "business_id" = CAST("business_id" AS text);
UPDATE "business" SET "id" = CAST("id" AS text);
UPDATE "contracts" SET "business_id" = CAST("business_id" AS text);
UPDATE "invoices" SET "business_id" = CAST("business_id" AS text);
UPDATE "package_groups" SET "business_id" = CAST("business_id" AS text);
UPDATE "packages" SET "business_id" = CAST("business_id" AS text);
UPDATE "ratings" SET "business_id" = CAST("business_id" AS text);
UPDATE "users" SET "business_id" = CAST("business_id" AS text);
UPDATE "contracts" SET "id" = CAST("id" AS text);--> statement-breakpoint
UPDATE "invoices" SET "id" = CAST("id" AS text);--> statement-breakpoint


ALTER TABLE "add_ons"
  ADD CONSTRAINT "add_ons_business_id_business_id_fk"
  FOREIGN KEY ("business_id")
  REFERENCES "business" ("id");

ALTER TABLE "add_ons_groups"
  ADD CONSTRAINT "add_ons_groups_business_id_business_id_fk"
  FOREIGN KEY ("business_id")
  REFERENCES "business" ("id");

ALTER TABLE "assets"
  ADD CONSTRAINT "assets_business_id_business_id_fk"
  FOREIGN KEY ("business_id")
  REFERENCES "business" ("id");

ALTER TABLE "availability"
  ADD CONSTRAINT "availability_business_id_business_id_fk"
  FOREIGN KEY ("business_id")
  REFERENCES "business" ("id");

ALTER TABLE "booking_types"
  ADD CONSTRAINT "booking_types_business_id_business_id_fk"
  FOREIGN KEY ("business_id")
  REFERENCES "business" ("id");

ALTER TABLE "bookings"
  ADD CONSTRAINT "bookings_business_id_business_id_fk"
  FOREIGN KEY ("business_id")
  REFERENCES "business" ("id");

ALTER TABLE "packages"
  ADD CONSTRAINT "packages_business_id_business_id_fk"
  FOREIGN KEY ("business_id")
  REFERENCES "business" ("id");

ALTER TABLE "contracts"
  ADD CONSTRAINT "contracts_business_id_business_id_fk"
  FOREIGN KEY ("business_id")
  REFERENCES "business" ("id");

ALTER TABLE "invoices"
  ADD CONSTRAINT "invoices_business_id_business_id_fk"
  FOREIGN KEY ("business_id")
  REFERENCES "business" ("id");

ALTER TABLE "package_groups"
  ADD CONSTRAINT "package_groups_business_id_business_id_fk"
  FOREIGN KEY ("business_id")
  REFERENCES "business" ("id");

ALTER TABLE "ratings"
  ADD CONSTRAINT "ratings_business_id_business_id_fk"
  FOREIGN KEY ("business_id")
  REFERENCES "business" ("id");