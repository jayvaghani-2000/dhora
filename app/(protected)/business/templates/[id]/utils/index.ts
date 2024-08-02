import {
  createField,
  deleteField,
  updateField,
} from "@/actions/(protected)/business/fields";
import {
  createRecipient,
  deleteRecipient,
  updateRecipient,
} from "@/actions/(protected)/business/recipients";
import {
  getTemplate,
  updateTemplate,
} from "@/actions/(protected)/business/templates";
import { updateTemplateMeta } from "@/actions/(protected)/business/templates-meta";

export const getTemplateById = async (id: string) => {
  if (!id) return;
  const initTemplate = await getTemplate(id);

  if (!initTemplate.success) {
    console.log(initTemplate);
    return;
  }

  return initTemplate.data.template;
};

export const handleTemplateUpdate = async (
  templateId: string,
  value: any,
  templateMeta: any
) => {
  await updateTemplate({
    name: value.title,
    id: templateId,
    globalAccessAuth: value.globalAccessAuth as string,
    externalId: value.externalId ?? "",
  });

  if (templateMeta) {
    await updateTemplateMeta({
      ...templateMeta,
      id: templateMeta.id ?? "",
    });
  }
};

export const handleRecipientUpdates = async (
  templateId: string,
  recipients: any[],
  value: any
) => {
  const updatedRecipients = recipients.filter(item => {
    const signer = value.signers.find((s: any) => s.formId === item.id);
    if (
      signer &&
      (signer.email !== item.email ||
        signer.name !== item.name ||
        signer.role !== item.role)
    ) {
      Object.assign(item, signer);
      return true;
    }
  });

  const deletedRecipients = recipients.filter(
    item => !value.signers.some((signer: any) => signer.formId === item.id)
  );

  const newRecipients = value.signers.filter((item: any) => !item.nativeId);

  await Promise.all([
    ...newRecipients.map((signer: any) =>
      createRecipient({
        name: signer.name,
        email: signer.email,
        role: signer.role,
        template_id: templateId,
      })
    ),
    ...updatedRecipients.map(signer =>
      updateRecipient({
        id: signer.id,
        name: signer.name,
        email: signer.email,
        role: signer.role,
      })
    ),
    ...deletedRecipients.map(signer => deleteRecipient({ id: signer.id })),
  ]);
};

export const handleFieldUpdates = async (
  templateId: string,
  fields: any[],
  value: any
) => {
  const updatedFields = fields.filter(item => {
    const field = value.fields.find((f: any) => f.nativeId === item.id);
    if (field) {
      Object.assign(item, field);
      return true;
    }
  });

  const deletedFields = fields.filter(
    item => !value.fields.some((field: any) => field.nativeId === item.id)
  );

  const newFields = value.fields.filter((item: any) => !item.nativeId);

  await Promise.all([
    ...newFields.map((field: any) =>
      createField({
        ...field,
        template_id: templateId,
      })
    ),
    ...updatedFields.map(field => updateField({ ...field })),
    ...deletedFields.map(field => deleteField({ id: field.id })),
  ]);
};
