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

import { createInsertSchema, createSelectSchema } from "drizzle-zod";

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
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .default(sql`public.id_generator()`),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  username: varchar("username", { length: 256 }).unique().notNull(),
  password: text("password").notNull(),
  verification_code: text("verification_code"),
  verified: boolean("verified").default(false),
  stripe_id: text("stripe_id").notNull(),
  business_id: bigint("business_id", { mode: "number" }).references(
    () => businesses.id
  ),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one }) => ({
  business: one(businesses, {
    fields: [users.business_id],
    references: [businesses.id],
  }),
}));

export const businesses = pgTable("business", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .default(sql`public.id_generator()`),
  type: businessTypeEnum("type").notNull(),
  name: text("name").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const businessRelations = relations(businesses, ({ many }) => ({
  users: many(users),
}));

export const insertUserSchema = createInsertSchema(users).omit({
  verification_code: true,
  stripe_id: true,
});

export const selectUserSchema = createSelectSchema(users);

export const loginUserSchema = createSelectSchema(users).pick({
  username: true,
  password: true,
});

export const mailVerificationUserSchema = createSelectSchema(users).pick({
  verification_code: true,
});

export const meUserSchema = createSelectSchema(users).pick({
  email: true,
});

export const insertBusinessSchema = createInsertSchema(businesses);

export const selectBusinessSchema = createSelectSchema(businesses);
