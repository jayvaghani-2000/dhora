import { z } from "zod";

import { DEFAULT_DOCUMENT_DATE_FORMAT } from "@/lib/constants/date-formats";
import { DEFAULT_DOCUMENT_TIME_ZONE } from "@/lib/constants/time-zones";
import { URL_REGEX } from "@/lib/constants/url-regex";
import {
  ZDocumentAccessAuthTypesSchema,
  ZDocumentActionAuthTypesSchema,
} from "@/lib/types/document-auth";

import { ZMapNegativeOneToUndefinedSchema } from "../document-flow/add-settings.types";

export const ZAddTemplateSettingsFormSchema = z.object({
  title: z.string().trim().min(1, { message: "Title can't be empty" }),
  externalId: z.string().optional(),
  globalAccessAuth: ZMapNegativeOneToUndefinedSchema.pipe(
    ZDocumentAccessAuthTypesSchema.optional()
  ),
  globalActionAuth: ZMapNegativeOneToUndefinedSchema.pipe(
    ZDocumentActionAuthTypesSchema.optional()
  ),
  meta: z.object({
    subject: z.string(),
    message: z.string(),
    timezone: z.string().optional().default(DEFAULT_DOCUMENT_TIME_ZONE),
    dateFormat: z.string().optional().default(DEFAULT_DOCUMENT_DATE_FORMAT),
    redirectUrl: z
      .string()
      .optional()
      .refine(
        value => value === undefined || value === "" || URL_REGEX.test(value),
        {
          message: "Please enter a valid URL",
        }
      ),
  }),
});

export type TAddTemplateSettingsFormSchema = z.infer<
  typeof ZAddTemplateSettingsFormSchema
>;
