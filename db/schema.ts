import { timeZone, trimRichEditor } from "@/lib/common";
import { FieldType } from "@/lib/types/field-type";
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  date,
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

export const payViaTypeEnum = pgEnum("payViaType", [
  "stripe",
  "cash",
  "cheque",
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

export const fieldsTypeEnum = pgEnum("fieldsType", [
  "SIGNATURE",
  "FREE_SIGNATURE",
  "NAME",
  "EMAIL",
  "DATE",
  "TEXT",
  "NUMBER",
  "RADIO",
  "CHECKBOX",
  "DROPDOWN",
]);

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
  business_id: text("business_id").references(() => businesses.id),
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
  bookings: many(bookings),
  ratings: many(ratings),
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
  id: text("id")
    .notNull()
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
  package_groups: many(packageGroups),
  add_on_groups: many(addOnsGroups),
  add_ons: many(addOns),
  bookings: many(bookings),
  ratings: many(ratings),
}));

export const templates = pgTable("templates", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`public.id_generator()`),
  name: text("name").notNull().unique(),
  data: text("data").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  deleted: boolean("deleted").default(false),
  business_id: text("business_id")
    .references(() => businesses.id)
    .notNull(),
  globalAccessAuth: text("global_access_auth"),
  externalId: text("external_id").default("").notNull(),
});

export const templatesRelations = relations(templates, ({ one, many }) => ({
  business: one(businesses, {
    fields: [templates.business_id],
    references: [businesses.id],
  }),
  contracts: many(contracts),
  fields: many(fields),
  signatures: many(signatures),
  templateMeta: one(templateMeta),
  recipients: many(recipients),
}));

export const fields = pgTable("fields", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`public.id_generator()`),
  type: fieldsTypeEnum("type").notNull(),
  pageX: doublePrecision("pageX").notNull(),
  pageY: doublePrecision("pageY").notNull(),
  pageWidth: doublePrecision("pageWidth").notNull(),
  pageHeight: doublePrecision("pageHeight").notNull(),
  pageNumber: integer("pageNumber").notNull(),
  customText: text("customText"),
  inserted: boolean("inserted").default(true),
  required: boolean("required").default(false),
  deleted: boolean("deleted").default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  template_id: text("template_id")
    .references(() => templates.id, { onDelete: "cascade" })
    .notNull(),
  recipient_id: text("recipient_id")
    .references(() => recipients.id)
    .notNull(),
  fieldMeta: jsonb("fieldMeta").default({}),
  signerEmail: text("signerEmail"),
});

export const fieldsRelations = relations(fields, ({ one, many }) => ({
  template: one(templates, {
    fields: [fields.template_id],
    references: [templates.id],
  }),
  recipient: one(recipients, {
    fields: [fields.recipient_id],
    references: [recipients.id],
  }),
  signatures: many(signatures),
}));

export const signatures = pgTable("signatures", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`public.id_generator()`),
  signature: text("signature").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  recipient_id: text("recipient_id")
    .references(() => recipients.id)
    .notNull(),
  contract_id: text("contract_id")
    .references(() => contracts.id)
    .notNull(),
  fields_id: text("fields_id")
    .references(() => fields.id)
    .notNull(),
  signatureImageAsBase64: text("signature_image_as_base64").notNull(),
  template_id: text("template_id")
    .references(() => templates.id, { onDelete: "cascade" })
    .notNull(),
});

export const signaturesRelations = relations(signatures, ({ one }) => ({
  recipient: one(recipients, {
    fields: [signatures.recipient_id],
    references: [recipients.id],
  }),
  contract: one(contracts, {
    fields: [signatures.contract_id],
    references: [contracts.id],
  }),
  fields: one(fields, {
    fields: [signatures.fields_id],
    references: [fields.id],
  }),
  template: one(templates, {
    fields: [signatures.template_id],
    references: [templates.id],
  }),
}));

export const templateMeta = pgTable("template_meta", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`public.id_generator()`),
  subject: text("subject"),
  message: text("message"),
  timezone: text("timezone").default(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  ),
  password: text("password"),
  dateFormat: text("dateFormat").default("yyyy-MM-dd hh:mm a"),
  template_id: text("template_id")
    .references(() => templates.id, { onDelete: "cascade" })
    .notNull(),
  redirectUrl: text("redirectUrl"),
});

export const templateMetaRelations = relations(templateMeta, ({ one }) => ({
  template: one(templates, {
    fields: [templateMeta.template_id],
    references: [templates.id],
  }),
}));

export const contracts = pgTable("contracts", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`public.id_generator()`),
  name: text("name").default("New Contract"),
  business_id: text("business_id")
    .references(() => businesses.id)
    .notNull(),
  event_id: text("event_id").references(() => events.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  deleted: boolean("deleted").default(false),
  deletedAt: timestamp("deletedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
  status: text("status").default("DRAFT").notNull(),
  template_id: text("template_id")
    .unique()
    .references(() => templates.id, { onDelete: "cascade" }),
});

export const contractsRelations = relations(contracts, ({ one, many }) => ({
  business: one(businesses, {
    fields: [contracts.business_id],
    references: [businesses.id],
  }),
  event: one(events, {
    fields: [contracts.event_id],
    references: [events.id],
  }),
  recipients: many(recipients),
  fields: many(fields),
  template: one(templates, {
    fields: [contracts.template_id],
    references: [templates.id],
  }),
}));

export const recipients = pgTable("recipients", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`public.id_generator()`),
  contracts_id: text("contracts_id").references(() => contracts.id),
  template_id: text("template_id").references(() => templates.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  contractDeletedAt: timestamp("contract_deleted_at"),
  expiredAt: timestamp("expired_at"),
  signedAt: timestamp("signed_at"),
  role: text("role").notNull(),
  readStatus: boolean("read_status").default(false),
  signingStatus: boolean("signing_status").default(false),
  sendStatus: boolean("send_status").default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const recipientsRelations = relations(recipients, ({ one, many }) => ({
  contracts: one(contracts, {
    fields: [recipients.contracts_id],
    references: [contracts.id],
  }),
  template: one(templates, {
    fields: [recipients.template_id],
    references: [templates.id],
  }),
  fields: many(fields),
  signatures: many(signatures),
}));

export const invoices = pgTable("invoices", {
  id: text("id")
    .notNull()
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
  business_id: text("business_id")
    .references(() => businesses.id)
    .notNull(),
  platform_fee: integer("platform_fee").default(2).notNull(),
  due_date: timestamp("due_date").notNull(),
  status: invoiceStatusTypeEnum("status").notNull(),
  stripe_ref: text("stripe_ref"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  pay_via: payViaTypeEnum("pay_via").default("stripe"),
  invoice: text("invoice"),
  notes: text("notes"),
  event_id: text("event_id").references(() => events.id),
});

export const invoicesRelations = relations(invoices, ({ one }) => ({
  business: one(businesses, {
    fields: [invoices.business_id],
    references: [businesses.id],
  }),
  event: one(events, {
    fields: [invoices.event_id],
    references: [events.id],
  }),
}));

export const availability = pgTable("availability", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`public.id_generator()`),
  business_id: text("business_id")
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
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`public.id_generator()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  deleted: boolean("deleted").default(false),
  availability_id: text("availability_id")
    .references(() => availability.id)
    .notNull(),
  business_id: text("business_id")
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
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`public.id_generator()`),
  title: text("title").notNull(),
  logo: text("logo"),
  description: text("description").notNull(),
  deleted: boolean("deleted").default(false),
  completed: boolean("completed").default(false),
  single_day_event: boolean("single_day_event").default(false),
  from_date: date("from_date"),
  to_date: date("to_date"),
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
  contracts: many(contracts),
  sub_events: many(subEvents),
  bookings: many(bookings),
  ratings: many(ratings),
}));

export const subEvents = pgTable("sub_events", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`public.id_generator()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  event_date: date("event_date").notNull(),
  start_time: text("start_time").notNull(),
  end_time: text("end_time").notNull(),
  location: text("location"),
  event_id: text("event_id").references(() => events.id),
  deleted: boolean("deleted").default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const subEventsRelations = relations(subEvents, ({ one, many }) => ({
  event: one(events, {
    fields: [subEvents.event_id],
    references: [events.id],
  }),
  bookings: many(bookings),
}));

export const assets = pgTable("assets", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`public.id_generator()`),
  height: integer("height"),
  width: integer("width"),
  blur_url: text("blur_url"),
  url: text("url"),
  asset_type: assetsTypeEnum("asset_type").notNull(),
  type: text("type"),
  business_id: text("business_id").references(() => businesses.id),
  user_id: text("user_id").references(() => users.id),
  package_id: text("package_id").references(() => packages.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const assetsRelations = relations(assets, ({ one }) => ({
  user: one(users, {
    fields: [assets.user_id],
    references: [users.id],
  }),
  business: one(businesses, {
    fields: [assets.business_id],
    references: [businesses.id],
  }),
  package: one(packages, {
    fields: [assets.package_id],
    references: [packages.id],
  }),
}));

export const packageGroups = pgTable(
  "package_groups",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .default(sql`public.id_generator()`),
    business_id: text("business_id").references(() => businesses.id),
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
  packageGroups,
  ({ one, many }) => ({
    business: one(businesses, {
      fields: [packageGroups.business_id],
      references: [businesses.id],
    }),
    packages: many(packages),
  })
);

export const packages = pgTable(
  "packages",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .default(sql`public.id_generator()`),
    business_id: text("business_id").references(() => businesses.id),
    package_group_id: text("package_group_id").references(
      () => packageGroups.id
    ),
    name: text("name"),
    description: text("description"),
    fixed_priced: boolean("fixed_priced").default(false),
    unit: packageUnitTypeEnum("unit"),
    unit_qty: integer("unit_qty").default(1),
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
  bookings: many(bookings),
}));

export const addOnsGroups = pgTable(
  "add_ons_groups",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .default(sql`public.id_generator()`),
    business_id: text("business_id").references(() => businesses.id),
    name: text("name"),
    deleted: boolean("deleted").default(false),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  t => ({
    unique_add_on_grouped_name: unique("unique_add_on_grouped_name").on(
      t.business_id,
      t.name
    ),
  })
);

export const addOnsGroupsRelations = relations(
  addOnsGroups,
  ({ one, many }) => ({
    business: one(businesses, {
      fields: [addOnsGroups.business_id],
      references: [businesses.id],
    }),
    packages: many(addOns),
  })
);

export const addOns = pgTable(
  "add_ons",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .default(sql`public.id_generator()`),
    business_id: text("business_id").references(() => businesses.id),
    add_on_group_id: text("add_on_group_id").references(() => addOnsGroups.id),
    name: text("name"),
    description: text("description"),
    max_unit: integer("max_unit"),
    unit_qty: integer("unit_qty").default(1),
    unit_rate: integer("unit_rate"),
    deleted: boolean("deleted").default(false),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  t => ({
    unique_add_on_name: unique("unique_add_on_name").on(t.business_id, t.name),
  })
);

export const addOnsRelations = relations(addOns, ({ one, many }) => ({
  business: one(businesses, {
    fields: [addOns.business_id],
    references: [businesses.id],
  }),
  bookings: many(bookings),
}));

export const bookings = pgTable("bookings", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`public.id_generator()`),
  business_id: text("business_id").references(() => businesses.id),
  customer_id: text("customer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  time: text("time"),
  end: text("end"),
  event_id: text("event_id").references(() => events.id),
  duration: integer("duration"),
  deleted: boolean("deleted").default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  business: one(businesses, {
    fields: [bookings.business_id],
    references: [businesses.id],
  }),
  customer: one(users, {
    fields: [bookings.customer_id],
    references: [users.id],
  }),
  event: one(events, {
    fields: [bookings.event_id],
    references: [events.id],
  }),
  bookings_sub_events: many(bookingsSubEvents),
  bookings_packages: many(bookingsPackages),
  bookings_add_ons: many(bookingsAddOns),
}));

export const ratings = pgTable("ratings", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`public.id_generator()`),
  description: text("description"),
  title: text("title"),
  rating: doublePrecision("rating").notNull(),
  business_id: text("business_id").references(() => businesses.id),
  customer_id: text("customer_id").references(() => users.id),
  event_id: text("event_id").references(() => events.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const ratingsRelations = relations(ratings, ({ one, many }) => ({
  business: one(businesses, {
    fields: [ratings.business_id],
    references: [businesses.id],
  }),
  customer: one(users, {
    fields: [ratings.customer_id],
    references: [users.id],
  }),
  event: one(events, {
    fields: [ratings.event_id],
    references: [events.id],
  }),
}));

export const bookingsSubEvents = pgTable("bookings_sub_events", {
  booking_id: text("booking_id").references(() => bookings.id, {
    onDelete: "cascade",
  }),
  sub_event_id: text("sub_event_id").references(() => subEvents.id, {
    onDelete: "cascade",
  }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const bookingsSubEventsRelations = relations(
  bookingsSubEvents,
  ({ one, many }) => ({
    booking: one(bookings, {
      fields: [bookingsSubEvents.booking_id],
      references: [bookings.id],
    }),
  })
);

export const bookingsPackages = pgTable("bookings_packages", {
  booking_id: text("booking_id").references(() => bookings.id, {
    onDelete: "cascade",
  }),
  package_id: text("package_id").references(() => packages.id, {
    onDelete: "cascade",
  }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const bookingsPackagesRelations = relations(
  bookingsPackages,
  ({ one }) => ({
    booking: one(bookings, {
      fields: [bookingsPackages.booking_id],
      references: [bookings.id],
    }),
  })
);

export const bookingsAddOns = pgTable("bookings_add_ons", {
  booking_id: text("booking_id").references(() => bookings.id, {
    onDelete: "cascade",
  }),
  add_on_id: text("add_on_id").references(() => addOns.id, {
    onDelete: "cascade",
  }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const bookingsAddOnsRelations = relations(bookingsAddOns, ({ one }) => ({
  booking: one(bookings, {
    fields: [bookingsAddOns.booking_id],
    references: [bookings.id],
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

export const createTemplateSchema = createSelectSchema(templates).pick({
  name: true,
  data: true,
  id: true,
  globalAccessAuth: true,
  externalId: true,
});

export const deleteTemplateSchema = createSelectSchema(templates).pick({
  id: true,
});

export const createTemplateMetaSchema = createSelectSchema(templateMeta).pick({
  subject: true,
  message: true,
  timezone: true,
  dateFormat: true,
  redirectUrl: true,
  id: true,
});

export const createRecipientSchema = createSelectSchema(recipients).pick({
  name: true,
  email: true,
  role: true,
  template_id: true,
});

export const updateRecipientSchema = createSelectSchema(recipients).pick({
  name: true,
  email: true,
  role: true,
  id: true,
});

export const deleteRecipientSchema = createSelectSchema(recipients).pick({
  id: true,
});

export const createFieldSchema = createSelectSchema(fields).pick({
  type: true,
  pageNumber: true,
  pageX: true,
  pageY: true,
  pageWidth: true,
  pageHeight: true,
  customText: true,
  inserted: true,
  required: true,
  template_id: true,
  recipient_id: true,
  fieldMeta: true,
  signerEmail: true,
  id: true,
});

export const deleteFieldSchema = createSelectSchema(fields).pick({
  id: true,
});

export const createContractSchema = createSelectSchema(contracts).pick({
  name: true,
});

export const updateContractSchema = createSelectSchema(contracts).pick({
  name: true,
  id: true,
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
      customer_contact: z.string().refine(data => data.length > 0, {
        message: "Phone number is required",
      }),
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
      event_id: z.string(),
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
    unit_qty: true,
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
      unit_qty: z.number().int().optional().nullable(),
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
      } else if (data.unit_qty && data.unit_qty < 0) {
        return false;
      } else {
        return true;
      }
    },
    {
      message: "Quantity be a positive",
      path: ["unit_qty"],
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
      } else if (data.unit_qty && data.unit_qty < 0) {
        return false;
      } else {
        return true;
      }
    },
    {
      message: "Quantity be a positive",
      path: ["unit_qty"],
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
      } else if (
        data.max_unit === undefined ||
        data.min_unit === undefined ||
        data.max_unit === null ||
        data.min_unit === null
      ) {
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

export const subEventSchema = createInsertSchema(subEvents)
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
    title: true,
    description: true,
    event_id: true,
    event_date: true,
  })
  .merge(
    z.object({
      title: z.string().refine(data => data.trim().length > 0, {
        message: "Title is required",
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
      event_date: z.date(),
    })
  );

export const createSubEventSchema = subEventSchema;
export const updateSubEventSchema = subEventSchema;

const addOnSchema = createInsertSchema(addOns)
  .omit({
    id: true,
    name: true,
    description: true,
    updated_at: true,
    created_at: true,
    unit_rate: true,
    max_unit: true,
    add_on_group_id: true,
    unit_qty: true,
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
      unit_rate: z.number().positive(),
      max_unit: z.number().int().positive().nullable().optional(),
      unit_qty: z.number().int().positive(),
      add_on_group_id: z.string().optional().nullable(),
    })
  );

export const createAddOnSchema = addOnSchema;

export const updateAddOnSchema = addOnSchema.merge(
  z.object({
    id: z.string(),
  })
);
