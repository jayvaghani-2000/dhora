import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { config } from "@/config";

const db = postgres(config.env.DATABASE_URL, { max: 1 });

async function main() {
  console.log("migration started...");
  await migrate(drizzle(db), { migrationsFolder: "drizzle" });
  console.log("migration ended...");
  process.exit(0);
}

main().catch(err => {
  console.log(err);
  process.exit(0);
});
