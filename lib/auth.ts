import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { config } from "@/config";
import { db } from "@/lib/db";
import { sessions, userSchema, users } from "@/db/schema";
import { z } from "zod";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: config.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: attributes => {
    return { email: attributes.email, business_id: attributes.business_id };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: z.infer<typeof userSchema>;
  }
}
