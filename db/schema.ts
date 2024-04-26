import { trimRichEditor } from "@/lib/common";
import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  doublePrecision,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { isNumber } from "lodash";
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
export const assetsTypeEnum = pgEnum("assetsType", [
  "business_assets",
  "package_assets",
]);

export const packageUnitTypeEnum = pgEnum("packageUnitType", [
  "days",
  "hours",
  "peoples",
]);

export const depositTypeEnum = pgEnum("depositType", ["fixed", "percentage"]);

export const users = pgTable("users", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`public.id_generator()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  email_verified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  password: text("password").notNull(),
  verification_code: text("verification_code"),
  stripe_id: text("stripe_id").notNull(),
  business_id: bigint("business_id", { mode: "bigint" }).references(
    () => businesses.id
  ),
  deleted: boolean("deleted").default(false),
  disabled: boolean("disabled").default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  business: one(businesses, {
    fields: [users.business_id],
    references: [businesses.id],
  }),
  events: many(events),
  assets: many(assets),
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
  description: text("description"),
  name: text("name").notNull(),
  address: text("address"),
  contact: varchar("contact", { length: 20 }),
  logo: text("logo"),
  stripe_id: text("stripe_id"),
  stripe_account_verified: timestamp("stripe_account_verified", {
    mode: "date",
  }),
  user_id: text("user_id"),
  deleted: boolean("deleted").default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const businessRelations = relations(businesses, ({ many }) => ({
  users: many(users),
  contacts: many(contracts),
  invoices: many(invoices),
  availability: many(availability),
  booking_types: many(bookingTypes),
  assets: many(assets),
  packages: many(packages),
  package_groups: many(package_groups),
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
  event_id: bigint("event_id", { mode: "bigint" }).references(() => events.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const contractsRelations = relations(contracts, ({ one }) => ({
  business: one(businesses, {
    fields: [contracts.business_id],
    references: [businesses.id],
  }),
  event: one(events, {
    fields: [contracts.event_id],
    references: [events.id],
  }),
}));

export const invoices = pgTable("invoices", {
  id: bigint("id", { mode: "bigint" })
    .primaryKey()
    .default(sql`public.id_generator()`),
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
  invoice: text("invoice"),
  notes: text("notes"),
});

export const invoicesRelations = relations(invoices, ({ one }) => ({
  business: one(businesses, {
    fields: [invoices.business_id],
    references: [businesses.id],
  }),
}));

export const availability = pgTable("availability", {
  id: bigint("id", { mode: "bigint" })
    .primaryKey()
    .default(sql`public.id_generator()`),
  business_id: bigint("business_id", { mode: "bigint" })
    .references(() => businesses.id)
    .notNull(),
  name: text("name"),
  days: integer("days").array(),
  timezone: text("timezone"),
  availability: jsonb("availability"),
  default: boolean("default"),
  deleted: boolean("deleted").default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const availabilityRelations = relations(
  availability,
  ({ one, many }) => ({
    business: one(businesses, {
      fields: [availability.business_id],
      references: [businesses.id],
    }),
    booking_types: many(bookingTypes),
  })
);

export const bookingTypes = pgTable("booking_types", {
  id: bigint("id", { mode: "bigint" })
    .primaryKey()
    .default(sql`public.id_generator()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  deleted: boolean("deleted").default(false),
  availability_id: bigint("availability_id", { mode: "bigint" })
    .references(() => availability.id)
    .notNull(),
  business_id: bigint("business_id", { mode: "bigint" })
    .references(() => businesses.id)
    .notNull(),
  booking_frequency: jsonb("booking_frequency"),
});

export const bookingTypesRelations = relations(bookingTypes, ({ one }) => ({
  availability: one(availability, {
    fields: [bookingTypes.availability_id],
    references: [availability.id],
  }),
  business: one(businesses, {
    fields: [bookingTypes.business_id],
    references: [businesses.id],
  }),
}));

export const events = pgTable("events", {
  id: bigint("id", { mode: "bigint" })
    .primaryKey()
    .default(sql`public.id_generator()`),
  title: text("title").notNull(),
  logo: text("logo"),
  description: text("description").notNull(),
  deleted: boolean("deleted").default(false),
  completed: boolean("completed").default(false),
  single_day_event: boolean("single_day_event").default(false),
  from_date: timestamp("from_date"),
  to_date: timestamp("to_date"),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const eventsRelations = relations(events, ({ many, one }) => ({
  user: one(users, {
    fields: [events.user_id],
    references: [users.id],
  }),
  invoices: many(invoices),
}));

export const assets = pgTable("assets", {
  id: bigint("id", { mode: "bigint" })
    .primaryKey()
    .default(sql`public.id_generator()`),
  height: integer("height"),
  width: integer("width"),
  blur_url: text("blur_url"),
  url: text("url"),
  asset_type: assetsTypeEnum("asset_type").notNull(),
  type: text("type"),
  business_id: bigint("business_id", { mode: "bigint" }).references(
    () => businesses.id
  ),
  user_id: text("user_id").references(() => users.id),
  package_id: bigint("package_id", { mode: "bigint" }).references(
    () => packages.id
  ),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const assetsRelations = relations(assets, ({ one }) => ({
  user: one(users, {
    fields: [assets.user_id],
    references: [users.id],
  }),
  business: one(businesses, {
    fields: [assets.user_id],
    references: [businesses.id],
  }),
  package: one(packages, {
    fields: [assets.package_id],
    references: [packages.id],
  }),
}));

export const package_groups = pgTable(
  "package_groups",
  {
    id: bigint("id", { mode: "bigint" })
      .primaryKey()
      .default(sql`public.id_generator()`),
    business_id: bigint("business_id", { mode: "bigint" }).references(
      () => businesses.id
    ),
    name: text("name"),
    deleted: boolean("deleted").default(false),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  t => ({
    unique_grouped_name: unique("unique_grouped_name").on(
      t.business_id,
      t.name
    ),
  })
);

export const packageGroupsRelations = relations(
  package_groups,
  ({ one, many }) => ({
    business: one(businesses, {
      fields: [package_groups.business_id],
      references: [businesses.id],
    }),
    packages: many(packages),
  })
);

export const packages = pgTable(
  "packages",
  {
    id: bigint("id", { mode: "bigint" })
      .primaryKey()
      .default(sql`public.id_generator()`),
    business_id: bigint("business_id", { mode: "bigint" }).references(
      () => businesses.id
    ),
    package_group_id: bigint("package_group_id", {
      mode: "bigint",
    }).references(() => package_groups.id),
    name: text("name"),
    description: text("description"),
    fixed_priced: boolean("fixed_priced").default(false),
    unit: packageUnitTypeEnum("unit"),
    min_unit: integer("min_unit"),
    max_unit: integer("max_unit"),
    unit_rate: integer("unit_rate"),
    deposit_type: depositTypeEnum("deposit_type"),
    deposit: doublePrecision("deposit"),
    deleted: boolean("deleted").default(false),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  t => ({
    unique_package_name: unique("unique_package_name").on(
      t.business_id,
      t.name
    ),
  })
);

export const packagesRelations = relations(packages, ({ one, many }) => ({
  business: one(businesses, {
    fields: [packages.business_id],
    references: [businesses.id],
  }),
  assets: many(assets),
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

export const createInvoiceSchema = createInsertSchema(invoices)
  .omit({
    id: true,
    business_id: true,
    status: true,
    created_at: true,
    updated_at: true,
  })
  .merge(
    z.object({
      items: z.array(
        z.object({
          name: z
            .string()
            .refine(data => data.length > 0, { message: "Name is required" }),
          price: z.number().positive({ message: "Price should be positive" }),
          quantity: z
            .number()
            .int({ message: "Quantity is invalid" })
            .min(1, { message: "Minimum qty should be 1." }),
          description: z.string().optional(),
          id: z.string(),
        })
      ),
      customer_contact: z
        .string()
        .refine(data => data.length > 0, { message: "Contact is required" }),
      customer_name: z.string().refine(data => data.length > 0, {
        message: "Customer name is required",
      }),
      customer_address: z
        .string()
        .refine(data => data.length > 0, { message: "Address is required" }),
      customer_email: z.string().email({ message: "Enter valid email" }),
      tax: z.number().refine(
        data => {
          const tax = data;
          if (Number.isInteger(tax) && tax >= 0 && tax <= 100) {
            return true;
          }
          return false;
        },
        { message: "Tax is invalid" }
      ),
    })
  );

export const createAvailabilitySchema = createInsertSchema(availability)
  .omit({
    id: true,
    business_id: true,
    created_at: true,
    updated_at: true,
  })
  .merge(
    z.object({
      availability: z.array(
        z
          .object({
            start_time: z.string(),
            end_time: z.string(),
          })
          .array()
      ),
    })
  );

export const editInvoiceSchema = createInvoiceSchema.merge(
  z.object({
    id: z.string(),
  })
);

const packageSchema = createInsertSchema(packages)
  .omit({
    id: true,
    name: true,
    description: true,
    updated_at: true,
    created_at: true,
    fixed_priced: true,
    unit: true,
    unit_rate: true,
    min_unit: true,
    max_unit: true,
    deposit_type: true,
    deposit: true,
    deleted: true,
    package_group_id: true,
    business_id: true,
  })
  .merge(
    z.object({
      name: z.string().refine(data => data.trim().length > 0, {
        message: "Name is required",
      }),
      description: z.string().refine(
        data => {
          if (
            data.trim() === "" ||
            trimRichEditor(data ?? "") === "<p><br></p>"
          ) {
            return false;
          }
          return true;
        },
        { message: "Description is required" }
      ),
      fixed_priced: z.boolean(),
      unit: z.enum(packageUnitTypeEnum.enumValues).optional().nullable(),
      unit_rate: z.number().positive().optional().nullable(),
      min_unit: z.number().int().optional().nullable(),
      max_unit: z.number().int().optional().nullable(),
      deposit_type: z.enum(depositTypeEnum.enumValues).optional().nullable(),
      deposit: z.number().positive().optional().nullable(),
      package_group_id: z.string().optional().nullable(),
    })
  );

export const createPackageSchema = packageSchema
  .refine(
    data => {
      if (data.fixed_priced) {
        return true;
      } else if (!data.unit) {
        return false;
      } else {
        return true;
      }
    },
    {
      message: "Unit is required",
      path: ["unit"],
    }
  )
  .refine(
    data => {
      if (data.fixed_priced) {
        return true;
      } else if (data.min_unit && data.min_unit < 0) {
        return false;
      } else {
        return true;
      }
    },
    {
      message: "Should be a positive",
      path: ["min_unit"],
    }
  )
  .refine(
    data => {
      if (data.fixed_priced) {
        return true;
      } else if (data.max_unit && data.max_unit < 0) {
        return false;
      } else {
        return true;
      }
    },
    {
      message: "Should be a positive",
      path: ["max_unit"],
    }
  )
  .refine(
    data => {
      if (data.fixed_priced) {
        return true;
      } else if (data.max_unit === undefined || data.min_unit === undefined) {
        return true;
      } else if (
        isNumber(data.min_unit) &&
        isNumber(data.max_unit) &&
        data.max_unit > data.min_unit
      ) {
        return true;
      }
      return false;
    },
    {
      message: "Max unit is invalid",
      path: ["max_unit"],
    }
  )
  .refine(
    data => {
      if (
        !data.deposit ||
        (data.deposit_type === "percentage" &&
          data.deposit &&
          data.deposit <= 100)
      ) {
        return true;
      } else if (data.deposit_type === "fixed") {
        return true;
      }
      return false;
    },
    {
      message: "Deposit must be less than 100%",
      path: ["deposit"],
    }
  );

export const editPackageSchema = packageSchema
  .merge(
    z.object({
      id: z.string(),
    })
  )
  .refine(
    data => {
      if (data.fixed_priced) {
        return true;
      } else if (!data.unit) {
        return false;
      } else {
        return true;
      }
    },
    {
      message: "Unit is required",
      path: ["unit"],
    }
  )
  .refine(
    data => {
      if (data.fixed_priced) {
        return true;
      } else if (data.min_unit && data.min_unit < 0) {
        return false;
      } else {
        return true;
      }
    },
    {
      message: "Should be a positive",
      path: ["min_unit"],
    }
  )
  .refine(
    data => {
      if (data.fixed_priced) {
        return true;
      } else if (data.max_unit && data.max_unit < 0) {
        return false;
      } else {
        return true;
      }
    },
    {
      message: "Should be a positive",
      path: ["max_unit"],
    }
  )
  .refine(
    data => {
      if (data.fixed_priced) {
        return true;
      } else if (data.max_unit === undefined || data.min_unit === undefined) {
        return true;
      } else if (
        isNumber(data.min_unit) &&
        isNumber(data.max_unit) &&
        data.max_unit > data.min_unit
      ) {
        return true;
      }
      return false;
    },
    {
      message: "Max unit is invalid",
      path: ["max_unit"],
    }
  )
  .refine(
    data => {
      if (
        !data.deposit ||
        (data.deposit_type === "percentage" &&
          data.deposit &&
          data.deposit <= 100)
      ) {
        return true;
      } else if (data.deposit_type === "fixed") {
        return true;
      }
      return false;
    },
    {
      message: "Deposit must be less than 100%",
      path: ["deposit"],
    }
  );
