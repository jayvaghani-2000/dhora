ALTER TABLE "assets" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "assets" ALTER COLUMN "type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assets" ADD COLUMN "asset_type" "assetsType" NOT NULL;