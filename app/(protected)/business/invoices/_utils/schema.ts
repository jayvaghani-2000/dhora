import { z } from "zod";

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
      rate: z
        .string()
        .refine(data => data.length > 0, { message: "Rate is required" }),
      quantity: z.string().refine(
        data => {
          const qty = Number(data);
          if (Number.isInteger(qty) && qty > 0) {
            return true;
          }
          return false;
        },
        { message: "Quantity is invalid" }
      ),
      description: z.string().optional(),
      id: z.string(),
    })
  ),
  tax: z.string().refine(
    data => {
      const tax = Number(data);
      if (Number.isInteger(tax) && tax > 0 && tax < 100) {
        return true;
      }
      return false;
    },
    { message: "Tax is invalid" }
  ),
});
