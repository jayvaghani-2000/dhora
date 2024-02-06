import { relations, sql } from "drizzle-orm";
import {
  bigint,
  pgEnum,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";

export const businessTypeEnum = pgEnum("businessType", [
  "unknown",
  "known",
  "popular",
]);

export const business = pgTable("business", {
  id: bigint("id", { mode: "bigint" })
    .primaryKey()
    .default(sql`public.id_generator()`),
  type: businessTypeEnum("type"),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: varchar("email", { length: 256 }),
  username: varchar("username", { length: 256 }),
  password: text("password"),
  businessId: bigint("business_id", { mode: "bigint" }).references(
    () => business.id
  ),
});

export const businessRelations = relations(business, ({ one }) => ({
  user: one(users, {
    fields: [business.id],
    references: [users.businessId],
  }),
}));
