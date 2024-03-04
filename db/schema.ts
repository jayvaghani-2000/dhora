import { relations, sql } from "drizzle-orm";
import {
  bigint,
  doublePrecision,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

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

export const invoiceStatusTypeEnum = pgEnum("invoiceStatusType", [
  "paid",
  "pending",
  "draft",
  "overdue",
]);

export const users = pgTable("users", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`public.id_generator()`),

  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  email_verified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  password: text("password").notNull(),
  verification_code: text("verification_code"),
  stripe_id: text("stripe_id").notNull(),
  business_id: bigint("business_id", { mode: "bigint" }).references(
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

export const sessions = pgTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const businesses = pgTable("business", {
  id: bigint("id", { mode: "bigint" })
    .primaryKey()
    .default(sql`public.id_generator()`),
  type: businessTypeEnum("type").notNull(),
  name: text("name").notNull(),
  address: text("address"),
  contact: varchar("contact", { length: 20 }),
  logo: jsonb("logo"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const businessRelations = relations(businesses, ({ many }) => ({
  users: many(users),
  contacts: many(contracts),
  invoices: many(invoices),
}));

export const contracts = pgTable("contracts", {
  id: bigint("id", { mode: "bigint" })
    .primaryKey()
    .default(sql`public.id_generator()`),
  template_id: integer("template_id").notNull().unique(),
  name: text("name").default("New Contract"),
  business_id: bigint("business_id", { mode: "bigint" })
    .references(() => businesses.id)
    .notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const contractsRelations = relations(contracts, ({ one }) => ({
  business: one(businesses, {
    fields: [contracts.business_id],
    references: [businesses.id],
  }),
}));

export const invoices = pgTable("invoices", {
  id: bigint("id", { mode: "bigint" })
    .primaryKey()
    .default(sql`public.id_generator()`),
  business_name: text("business_name").notNull(),
  business_contact: varchar("business_contact", { length: 20 }).notNull(),
  business_address: text("business_address"),
  business_email: text("business_email"),
  business_logo: jsonb("business_logo"),
  customer_name: text("customer_name").notNull(),
  customer_email: text("customer_email").notNull(),
  customer_contact: varchar("customer_contact", { length: 20 }).notNull(),
  customer_address: text("customer_address"),
  items: jsonb("items"),
  tax: integer("tax").notNull(),
  total: doublePrecision("total").notNull(),
  subtotal: doublePrecision("subtotal").notNull(),
  business_id: bigint("business_id", { mode: "bigint" })
    .references(() => businesses.id)
    .notNull(),
  platform_fee: integer("platform_fee").default(2).notNull(),
  due_date: timestamp("due_date").notNull(),
  status: invoiceStatusTypeEnum("status").notNull(),
  stripe_ref: text("stripe_ref"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const invoicesRelations = relations(invoices, ({ one }) => ({
  business: one(businesses, {
    fields: [invoices.business_id],
    references: [businesses.id],
  }),
}));

export const registerSchema = createInsertSchema(users)
  .omit({
    id: true,
    verification_code: true,
    stripe_id: true,
  })
  .merge(
    z.object({
      confirm_password: z.string().min(6, {
        message: "Password must match.",
      }),
      is_business: z.boolean(),
      business_type: z.enum(businessTypeEnum.enumValues).optional(),
      business_name: z.string().optional(),
      "t&c": z.boolean(),
    })
  )
  .refine(data => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  })
  .refine(
    data => {
      if (data.is_business) {
        return !!data.business_type && !!data.business_name;
      }
      return true;
    },
    {
      message: "Business category and name are required for business users.",
      path: ["is_business"],
    }
  )
  .refine(data => !!data["t&c"]);

export const userSchema = createSelectSchema(users);

export const createBusinessSchema = createInsertSchema(businesses);

export const loginSchema = createSelectSchema(users).pick({
  email: true,
  password: true,
});

export const mailVerificationUserSchema = createSelectSchema(users).pick({
  verification_code: true,
});

export const meUserSchema = createSelectSchema(users).pick({
  email: true,
});

export const createContractSchema = createSelectSchema(contracts).pick({
  template_id: true,
  name: true,
});
