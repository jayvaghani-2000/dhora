import { config } from "@/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";
import { sql } from "drizzle-orm";

const client = postgres(config.env.DATABASE_URL);

export const db = drizzle(client, { schema, logger: false });

export const getBigIntId = db.execute(sql`SELECT public.id_generator()`);
