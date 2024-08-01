"use server";

import { z } from "zod";
import { User } from "lucia";
import { templates, createTemplateSchema } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { and, eq } from "drizzle-orm";
import { getTemplate } from "./getTemplate";
import { createField } from "../fields";
import { createRecipient } from "../recipients";

const duplicateTemplateSchema = createTemplateSchema.pick({ id: true });

const handler = async (
  user: User,
  values: z.infer<typeof duplicateTemplateSchema>
) => {
  try {
    const { data } = await getTemplate(values.id);
    const findTemplate = data?.template;
    if (!findTemplate) {
      return { success: false as false, error: "Template not found" };
    }

    const duplicateTemplate = await db
      .insert(templates)
      .values({
        name: findTemplate.name,
        data: findTemplate.data,
        business_id: user.business_id!,
        globalAccessAuth: findTemplate.globalAccessAuth,
        externalId: findTemplate.externalId,
      })
      .returning();

    findTemplate.recipients.forEach(async recipient => {
      const getRecipientFields = findTemplate.fields.filter(
        field => field.recipient_id === recipient.id
      );
      const newRecipient = await createRecipient({
        name: recipient.name,
        email: recipient.email,
        template_id: duplicateTemplate[0].id,
        role: recipient.role,
      });
      getRecipientFields.forEach(async field => {
        await createField({
          template_id: duplicateTemplate[0].id,
          recipient_id: newRecipient.data?.id ?? "",
          type: field.type,
          signerEmail: field?.signerEmail ?? "",
          pageHeight: field.pageHeight,
          pageWidth: field.pageWidth,
          pageX: field.pageX,
          pageY: field.pageY,
          pageNumber: field.pageNumber,
          fieldMeta: field.fieldMeta,
        });
      });
    });
    return { success: true as true, data: duplicateTemplate[0] };
  } catch (err) {
    return errorHandler(err);
  }
};

export const duplicateTemplate: (
  values: z.infer<typeof duplicateTemplateSchema>
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
