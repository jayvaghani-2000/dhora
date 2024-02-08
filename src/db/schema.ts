import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  pgEnum,
  pgTable,
  serial,
  text,
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

export const userTypeEnum = pgEnum("userType", [
  "regular_user",
  "business_user",
]);

export const business = pgTable("business", {
  id: bigint("id", { mode: "bigint" })
    .primaryKey()
    .default(sql`public.id_generator()`),
  business_type: businessTypeEnum("type"),
  name: text("name"),
  user_id: bigint("user_id", { mode: "bigint" })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  first_name: text("first_name"),
  last_name: text("last_name"),
  email: varchar("email", { length: 256 }).unique(),
  username: varchar("username", { length: 256 }).unique(),
  password: text("password"),
  user_type: userTypeEnum("user_type"),
  verification_code: text("verification_code"),
  verified: boolean("verified").default(false),
});

export const businessRelations = relations(business, ({ one }) => ({
  user: one(users, {
    fields: [business.user_id],
    references: [users.id],
  }),
}));
