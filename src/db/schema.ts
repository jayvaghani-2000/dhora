import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const businessTypeEnum = pgEnum("businessType", [
  "Event Planner",
  "Venue",
  "Photo & Video",
  "Entertainment",
  "Caterer",
  "Apparel",
  "Health & Beauty",
  "Other",
]);

export const users = pgTable("users", {
  id: bigint("id", { mode: "bigint" })
    .primaryKey()
    .default(sql`public.id_generator()`),
  first_name: text("first_name"),
  last_name: text("last_name"),
  email: varchar("email", { length: 256 }).unique(),
  username: varchar("username", { length: 256 }).unique(),
  password: text("password"),
  verification_code: text("verification_code"),
  verified: boolean("verified").default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const business = pgTable("business", {
  id: bigint("id", { mode: "bigint" })
    .primaryKey()
    .default(sql`public.id_generator()`),
  business_type: businessTypeEnum("type"),
  name: text("name"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  user_id: bigint("user_id", { mode: "bigint" })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});

export const businessRelations = relations(business, ({ one }) => ({
  user: one(users, {
    fields: [business.user_id],
    references: [users.id],
  }),
}));
