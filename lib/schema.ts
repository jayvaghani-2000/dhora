import { createInvoiceSchema, businessTypeEnum } from "@/db/schema";
import { z } from "zod";

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

export const businessDetailSchema = z.object({
  business_name: z
    .string()
    .refine(data => data.trim().length > 0, { message: "Name is required" }),
  business_address: z
    .string()
    .refine(data => data.trim().length > 0, { message: "Address is required" }),
  business_contact: z
    .string()
    .refine(data => data.trim().length > 0, { message: "Contact is required" }),
  business_email: z.string().email({ message: "Enter valid email" }),
});

export const invoiceSchema = createInvoiceSchema.merge(businessDetailSchema);

export const settingsBusinessDetailSchema = businessDetailSchema.merge(
  z.object({
    business_type: z.enum(businessTypeEnum.enumValues, {
      required_error: "Category is required",
    }),
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
      if (data.trim() === "" || data === "<p><br></p>") {
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
