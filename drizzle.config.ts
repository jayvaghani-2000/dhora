import type { Config } from "drizzle-kit";
import { config } from "@/config";

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  verbose: true,
  dbCredentials: {
    connectionString: config.env.DATABASE_URL ?? "",
  },
} as Config;
