import { z } from "zod";

import { ZRecipientActionAuthTypesSchema } from "@/lib/types/document-auth";

import { ZMapNegativeOneToUndefinedSchema } from "../document-flow/add-settings.types";
import { RecipientRole } from "@/lib/types/recipient-role";

export const ZAddTemplatePlacholderRecipientsFormSchema = z
  .object({
    signers: z.array(
      z.object({
        formId: z.string().min(1),
        nativeId: z.number().optional(),
        email: z.string().min(1).email(),
        name: z.string(),
        role: z.nativeEnum(RecipientRole),
        actionAuth: ZMapNegativeOneToUndefinedSchema.pipe(
          ZRecipientActionAuthTypesSchema.optional()
        ),
        id: z.string().optional(),
      })
    ),
  })
  .refine(
    schema => {
      const emails = schema.signers.map(signer => signer.email.toLowerCase());

      return new Set(emails).size === emails.length;
    },
    // Dirty hack to handle errors when .root is populated for an array type
    { message: "Signers must have unique emails", path: ["signers__root"] }
  );

export type TAddTemplatePlacholderRecipientsFormSchema = z.infer<
  typeof ZAddTemplatePlacholderRecipientsFormSchema
>;
