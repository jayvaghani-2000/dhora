import { fieldsTypeEnum } from "@/db/schema";
import { ZFieldMetaSchema } from "@/lib/types/field-meta";
import { FieldType } from "@/lib/types/field-type";
import { z } from "zod";

export const ZDocumentFlowFormSchema = z.object({
  title: z.string().min(1),

  signers: z
    .array(
      z.object({
        formId: z.string().min(1),
        nativeId: z.number().optional(),
        email: z.string().min(1).email(),
        name: z.string(),
      })
    )
    .refine(signers => {
      const emails = signers.map(signer => signer.email);
      return new Set(emails).size === emails.length;
    }, "Signers must have unique emails"),

  fields: z.array(
    z.object({
      formId: z.string().min(1),
      nativeId: z.number().optional(),
      type: z.nativeEnum(FieldType),
      signerEmail: z.string().min(1).optional(),
      pageNumber: z.number().min(1),
      pageX: z.number().min(0),
      pageY: z.number().min(0),
      pageWidth: z.number().min(0),
      pageHeight: z.number().min(0),
      fieldMeta: ZFieldMetaSchema,
    })
  ),

  email: z.object({
    subject: z.string(),
    message: z.string(),
  }),
});

export interface DocumentFlowStep {
  title: string;
  description: string;
  stepIndex?: number;
  onBackStep?: () => unknown;
  onNextStep?: () => unknown;
}
export type TDocumentFlowFormSchema = z.infer<typeof ZDocumentFlowFormSchema>;

export const FRIENDLY_FIELD_TYPE: Record<FieldType, string> = {
  [FieldType.SIGNATURE]: "Signature",
  [FieldType.FREE_SIGNATURE]: "Free Signature",
  [FieldType.TEXT]: "Text",
  [FieldType.DATE]: "Date",
  [FieldType.EMAIL]: "Email",
  [FieldType.NAME]: "Name",
  [FieldType.NUMBER]: "Number",
  [FieldType.RADIO]: "Radio",
  [FieldType.CHECKBOX]: "Checkbox",
  [FieldType.DROPDOWN]: "Select",
};
