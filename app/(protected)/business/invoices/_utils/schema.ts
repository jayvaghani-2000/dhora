import { createInvoiceSchema } from "@/db/schema";
import { z } from "zod";

export type invoiceSchemaType = z.infer<typeof invoiceSchema>;
export type businessDetailSchemaType = z.infer<typeof businessDetailSchema>;

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

const detailWithLogo = businessDetailSchema.merge(
  z.object({ logo: z.string() })
);

export const invoiceSchema = createInvoiceSchema.merge(businessDetailSchema);
