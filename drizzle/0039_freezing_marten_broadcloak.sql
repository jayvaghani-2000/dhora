ALTER TABLE "bookings" DROP CONSTRAINT "bookings_add_on_id_add_ons_id_fk";
ALTER TABLE "add_ons" DROP CONSTRAINT "add_ons_add_on_group_id_add_ons_groups_id_fk";
ALTER TABLE "assets" DROP CONSTRAINT "assets_package_id_packages_id_fk";
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_package_id_packages_id_fk";
ALTER TABLE "packages" DROP CONSTRAINT "packages_package_group_id_package_groups_id_fk";




ALTER TABLE "add_ons" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "add_ons" ALTER COLUMN "add_on_group_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "add_ons_groups" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "assets" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "assets" ALTER COLUMN "package_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "add_on_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "package_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "package_groups" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "packages" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "packages" ALTER COLUMN "package_group_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ratings" ALTER COLUMN "id" SET DATA TYPE text;



UPDATE "add_ons" SET "id" = CAST("id" AS text);--> statement-breakpoint
UPDATE "add_ons" SET "add_on_group_id" = CAST("add_on_group_id" AS text);--> statement-breakpoint
UPDATE "add_ons_groups" SET "id" = CAST("id" AS text);--> statement-breakpoint
UPDATE "assets" SET "id" = CAST("id" AS text);--> statement-breakpoint
UPDATE "assets" SET "package_id" = CAST("package_id" AS text);--> statement-breakpoint
UPDATE "bookings" SET "id" = CAST("id" AS text);--> statement-breakpoint
UPDATE "bookings" SET "add_on_id" = CAST("add_on_id" AS text);--> statement-breakpoint
UPDATE "bookings" SET "package_id" = CAST("package_id" AS text);--> statement-breakpoint
UPDATE "package_groups" SET "id" = CAST("id" AS text);--> statement-breakpoint
UPDATE "packages" SET "id" = CAST("id" AS text);--> statement-breakpoint
UPDATE "packages" SET "package_group_id" = CAST("package_group_id" AS text);--> statement-breakpoint
UPDATE "ratings" SET "id" = CAST("id" AS text);


ALTER TABLE "bookings"
  ADD CONSTRAINT "bookings_add_on_id_add_ons_id_fk"
  FOREIGN KEY ("add_on_id")
  REFERENCES "add_ons" ("id");


ALTER TABLE "add_ons"
  ADD CONSTRAINT "add_ons_add_on_group_id_add_ons_groups_id_fk"
  FOREIGN KEY ("add_on_group_id")
  REFERENCES "add_ons_groups" ("id");


ALTER TABLE "assets"
  ADD CONSTRAINT "assets_package_id_packages_id_fk"
  FOREIGN KEY ("package_id")
  REFERENCES "packages" ("id");

ALTER TABLE "bookings"
  ADD CONSTRAINT "bookings_package_id_packages_id_fk"
  FOREIGN KEY ("package_id")
  REFERENCES "packages" ("id");

ALTER TABLE "packages"
  ADD CONSTRAINT "packages_package_group_id_package_groups_id_fk"
  FOREIGN KEY ("package_group_id")
  REFERENCES "package_groups" ("id");
