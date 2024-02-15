import type { Config } from "drizzle-kit";
import { config } from "@/config";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: config.env.DATABASE_URL ?? "",
  },
} as Config;
