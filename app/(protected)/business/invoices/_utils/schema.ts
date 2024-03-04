import { z } from "zod";

export type invoiceSchemaType = z.infer<typeof invoiceSchema>;

export const invoiceSchema = z.object({
  business_name: z
    .string()
    .refine(data => data.length > 0, { message: "Name is required" }),
  business_address: z
    .string()
    .refine(data => data.length > 0, { message: "Address is required" }),
  business_contact: z
    .string()
    .refine(data => data.length > 0, { message: "Contact is required" }),
  customer_contact: z
    .string()
    .refine(data => data.length > 0, { message: "Contact is required" }),
  customer_name: z
    .string()
    .refine(data => data.length > 0, { message: "Customer name is required" }),
  customer_address: z
    .string()
    .refine(data => data.length > 0, { message: "Address is required" }),
  customer_email: z.string().email({ message: "Enter valid email" }),
  business_email: z.string().email({ message: "Enter valid email" }),
  items: z.array(
    z.object({
      name: z
        .string()
        .refine(data => data.length > 0, { message: "Name is required" }),
      price: z.number().min(0, { message: "Price should be positive" }),
      quantity: z
        .number()
        .int({ message: "Quantity is invalid" })
        .min(1, { message: "Minimum qty should be 1." }),
      description: z.string().optional(),
      id: z.string(),
    })
  ),
  tax: z.number().refine(
    data => {
      const tax = data;
      if (Number.isInteger(tax) && tax > 0 && tax < 100) {
        return true;
      }
      return false;
    },
    { message: "Tax is invalid" }
  ),
  due_date: z.date({
    required_error: "Due date is required",
  }),
  subtotal: z.number(),
  total: z.number(),
});
