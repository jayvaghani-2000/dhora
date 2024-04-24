import {
  createInvoiceSchema,
  businessTypeEnum,
  packageUnitTypeEnum,
  depositTypeEnum,
} from "@/db/schema";
import { z } from "zod";
import { trimRichEditor } from "./common";
import { isNumber } from "lodash";

export type invoiceSchemaType = z.infer<typeof invoiceSchema>;

export type businessDetailSchemaType = z.infer<typeof businessDetailSchema>;

export type createBookingTypeSchemaType = z.infer<
  typeof createBookingTypeSchema
>;
export type updatePasswordSchemaType = z.infer<typeof updatePasswordSchema>;

export type settingsBusinessDetailSchemaType = z.infer<
  typeof settingsBusinessDetailSchema
>;
export type editProfileSchemaType = z.infer<typeof editProfileSchema>;
export type editBookingTypeSchemaType = z.infer<typeof editBookingTypeSchema>;

export type createEventSchemaType = z.infer<typeof createEventSchema>;

export const businessDetailSchema = z.object({
  name: z
    .string()
    .refine(data => data.trim().length > 0, { message: "Name is required" }),
  address: z
    .string()
    .refine(data => data.trim().length > 0, { message: "Address is required" }),
  contact: z
    .string()
    .refine(data => data.trim().length > 0, { message: "Contact is required" }),
  email: z.string().email({ message: "Enter valid email" }),
});

export const invoiceSchema = createInvoiceSchema.merge(businessDetailSchema);

export const settingsBusinessDetailSchema = businessDetailSchema.merge(
  z.object({
    type: z.enum(businessTypeEnum.enumValues, {
      required_error: "Category is required",
    }),
    description: z.string(),
  })
);

export const updatePasswordSchema = z
  .object({
    old_password: z.string().min(6, { message: "Password is required" }),
    new_password: z.string().min(6, { message: "Password is required" }),
    confirm_new_password: z.string().min(6, {
      message: "Password must match.",
    }),
  })
  .refine(
    data => data.new_password.trim() === data.confirm_new_password.trim(),
    {
      message: "Passwords do not match.",
      path: ["confirm_new_password"],
    }
  )
  .refine(data => data.new_password.trim() !== data.old_password.trim(), {
    message: "New password can't be same",
    path: ["new_password"],
  });

export const createBookingTypeSchema = z.object({
  title: z
    .string()
    .refine(data => data.trim().length > 0, { message: "Title is required" }),
  description: z.string().refine(
    data => {
      if (data.trim() === "" || trimRichEditor(data ?? "") === "<p><br></p>") {
        return false;
      }
      return true;
    },
    { message: "Description is required" }
  ),
  duration: z
    .number()
    .positive({ message: "Duration must be valid number" })
    .refine(data => data > 0, { message: "Duration is required" }),
});

export const editBookingTypeSchema = createBookingTypeSchema.merge(
  z.object({
    availability_id: z.string(),
    booking_frequency: z
      .object({
        day: z.number().positive().int().optional(),
        week: z.number().positive().int().optional(),
        month: z.number().positive().int().optional(),
        year: z.number().positive().int().optional(),
      })
      .optional()
      .nullable()
      .refine(
        data => {
          const { day, month, week, year } = data || {};
          if (
            day &&
            ((month && month < day) ||
              (week && week < day) ||
              (year && year < day))
          ) {
            return false;
          }
          if (week && ((month && month < week) || (year && year < week))) {
            return false;
          }
          if (month && year && year < month) {
            return false;
          }
          return true;
        },
        {
          message:
            "Values must be in ascending order: day < week < month < year",
        }
      ),
  })
);

export const editProfileSchema = z.object({
  name: z
    .string()
    .refine(data => data.trim().length > 0, { message: "Name is required" }),
  email: z.string().email({ message: "Enter valid email" }),
});

export const createEventSchema = z.object({
  title: z
    .string()
    .refine(data => data.trim().length > 0, { message: "Name is required" }),
  description: z.string().refine(
    data => {
      if (data.trim() === "" || trimRichEditor(data ?? "") === "<p><br></p>") {
        return false;
      }
      return true;
    },
    { message: "Description is required" }
  ),
  single_day_event: z.boolean(),
  date: z.object({
    from: z.date(),
    to: z.date().optional(),
  }),
});

export const createPackageSchema = z
  .object({
    package_group_id: z.string().optional(),
    name: z
      .string()
      .refine(data => data.trim().length > 0, { message: "Name is required" }),
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
    unit: z.enum(packageUnitTypeEnum.enumValues).optional(),
    unit_rate: z.number().positive().optional(),
    min_unit: z.number().int().optional(),
    max_unit: z.number().int().optional(),
    deposit_type: z.enum(depositTypeEnum.enumValues).optional(),
    deposit: z.number().positive().optional(),
  })
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

export const createPackageGroupSchema = z.object({
  name: z
    .string()
    .refine(data => data.trim().length > 0, { message: "Name is required" }),
});
