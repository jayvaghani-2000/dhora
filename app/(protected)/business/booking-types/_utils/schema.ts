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
  })
);
