import { TAddFieldsFormSchema } from "@/components/ui/document-flow/add-fields.types";
import { DocumentFlowStep } from "@/components/ui/document-flow/types";

export enum FieldType {
  SIGNATURE = "SIGNATURE",
  FREE_SIGNATURE = "FREE_SIGNATURE",
  NAME = "NAME",
  EMAIL = "EMAIL",
  DATE = "DATE",
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  RADIO = "RADIO",
  CHECKBOX = "CHECKBOX",
  DROPDOWN = "DROPDOWN",
}

export type FieldFormType = {
  nativeId?: number;
  formId: string;
  pageNumber: number;
  type: FieldType;
  pageX: number;
  pageY: number;
  pageWidth: number;
  pageHeight: number;
  signerEmail: string;
  fieldMeta?: any;
};

export type AddFieldsFormProps = {
  documentFlow: DocumentFlowStep;
  hideRecipients?: boolean;
  recipients: any[];
  fields: any[];
  onSubmit: (_data: TAddFieldsFormSchema) => void;
  canGoBack?: boolean;
  isDocumentPdfLoaded: boolean;
  teamId?: number;
};
