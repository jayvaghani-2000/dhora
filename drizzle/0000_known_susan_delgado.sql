DO $$ BEGIN
 CREATE TYPE "businessType" AS ENUM('Event Planner', 'Venue', 'Photo & Video', 'Entertainment', 'Caterer', 'Apparel', 'Health & Beauty', 'Other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE SEQUENCE public.global_id_seq;
ALTER SEQUENCE public.global_id_seq OWNER TO postgres;

CREATE OR REPLACE FUNCTION public.id_generator()
    RETURNS bigint
    LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    our_epoch bigint := 1314220021721;
    seq_id bigint;
    now_millis bigint;
    -- the id of this DB shard, must be set for each
    -- schema shard you have - you could pass this as a parameter too
    shard_id int := 1;
    result bigint:= 0;
BEGIN
    SELECT nextval('public.global_id_seq') % 1024 INTO seq_id;

    SELECT FLOOR(EXTRACT(EPOCH FROM clock_timestamp()) * 1000) INTO now_millis;
    result := (now_millis - our_epoch) << 23;
    result := result | (shard_id << 10);
    result := result | (seq_id);
	return result;
END;
$BODY$;

ALTER FUNCTION public.id_generator() OWNER TO postgres;

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "business" (
	"id" bigint PRIMARY KEY DEFAULT public.id_generator() NOT NULL,
	"type" "businessType" NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" bigint PRIMARY KEY DEFAULT public.id_generator() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" varchar(256) NOT NULL,
	"username" varchar(256) NOT NULL,
	"password" text NOT NULL,
	"verification_code" text,
	"verified" boolean DEFAULT false,
	"stripe_id" text NOT NULL,
	"business_id" bigint,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
