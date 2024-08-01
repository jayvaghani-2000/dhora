DO $$ BEGIN
 CREATE TYPE "fieldsType" AS ENUM('SIGNATURE', 'FREE_SIGNATURE', 'NAME', 'EMAIL', 'DATE', 'TEXT', 'NUMBER', 'RADIO', 'CHECKBOX', 'DROPDOWN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fields" (
	"id" text PRIMARY KEY DEFAULT public.id_generator() NOT NULL,
	"type" "fieldsType" NOT NULL,
	"pageX" double precision NOT NULL,
	"pageY" double precision NOT NULL,
	"pageWidth" double precision NOT NULL,
	"pageHeight" double precision NOT NULL,
	"pageNumber" integer NOT NULL,
	"customText" text,
	"inserted" boolean DEFAULT true,
	"required" boolean DEFAULT false,
	"deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"template_id" text NOT NULL,
	"recipient_id" text NOT NULL,
	"fieldMeta" jsonb DEFAULT '{}'::jsonb,
	"signerEmail" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recipients" (
	"id" text PRIMARY KEY DEFAULT public.id_generator() NOT NULL,
	"contracts_id" text,
	"template_id" text,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"contract_deleted_at" timestamp,
	"expired_at" timestamp,
	"signed_at" timestamp,
	"role" text NOT NULL,
	"read_status" boolean DEFAULT false,
	"signing_status" boolean DEFAULT false,
	"send_status" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "signatures" (
	"id" text PRIMARY KEY DEFAULT public.id_generator() NOT NULL,
	"signature" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"recipient_id" text NOT NULL,
	"contract_id" text NOT NULL,
	"fields_id" text NOT NULL,
	"signature_image_as_base64" text NOT NULL,
	"template_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "template_meta" (
	"id" text PRIMARY KEY DEFAULT public.id_generator() NOT NULL,
	"subject" text,
	"message" text,
	"timezone" text DEFAULT 'Africa/Cairo',
	"password" text,
	"dateFormat" text DEFAULT 'yyyy-MM-dd hh:mm a',
	"template_id" text NOT NULL,
	"redirectUrl" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "templates" (
	"id" text PRIMARY KEY DEFAULT public.id_generator() NOT NULL,
	"name" text NOT NULL,
	"data" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false,
	"business_id" text NOT NULL,
	"global_access_auth" text,
	"external_id" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contracts" ALTER COLUMN "template_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "contracts" ADD COLUMN "deletedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "contracts" ADD COLUMN "completedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "contracts" ADD COLUMN "status" text DEFAULT 'DRAFT' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contracts" ADD CONSTRAINT "contracts_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fields" ADD CONSTRAINT "fields_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fields" ADD CONSTRAINT "fields_recipient_id_recipients_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "recipients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipients" ADD CONSTRAINT "recipients_contracts_id_contracts_id_fk" FOREIGN KEY ("contracts_id") REFERENCES "contracts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipients" ADD CONSTRAINT "recipients_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "signatures" ADD CONSTRAINT "signatures_recipient_id_recipients_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "recipients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "signatures" ADD CONSTRAINT "signatures_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "signatures" ADD CONSTRAINT "signatures_fields_id_fields_id_fk" FOREIGN KEY ("fields_id") REFERENCES "fields"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "signatures" ADD CONSTRAINT "signatures_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "template_meta" ADD CONSTRAINT "template_meta_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "templates" ADD CONSTRAINT "templates_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
