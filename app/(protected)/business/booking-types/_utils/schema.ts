import { z } from "zod";

export type createBookingTypeSchemaType = z.infer<
  typeof createBookingTypeSchema
>;

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
