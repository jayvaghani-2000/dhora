import React, { useState } from "react";
import {
  getTemplateById,
  handleFieldUpdates,
  handleRecipientUpdates,
  handleTemplateUpdate,
} from "../utils";

import { DocumentFlowFormContainer } from "@/components/ui/document-flow/document-flow-root";
import { Stepper } from "@/components/ui/stepper";
import { AddTemplateFieldsFormPartial } from "@/components/ui/template-flow/add-template-fields";
import { AddTemplatePlaceholderRecipientsFormPartial } from "@/components/ui/template-flow/add-template-placeholder-recipients";
import { AddTemplateSettingsFormPartial } from "@/components/ui/template-flow/add-template-settings";
import { DocumentFlowStep } from "@/components/ui/document-flow/types";
import { useRouter } from "next/navigation";

type EditTemplateStep = "settings" | "signers" | "fields";
const EditTemplateSteps: EditTemplateStep[] = ["settings", "signers", "fields"];

const documentFlow: Record<EditTemplateStep, DocumentFlowStep> = {
  settings: {
    title: "General",
    description: "Configure general settings for the template.",
    stepIndex: 1,
  },
  signers: {
    title: "Add Placeholders",
    description: "Add all relevant placeholders for each recipient.",
    stepIndex: 2,
  },
  fields: {
    title: "Add Fields",
    description: "Add all relevant fields for each recipient.",
    stepIndex: 3,
  },
};

interface TemplateEditorPropsType {
  isDocumentPdfLoaded: boolean;
  template: any;
  setTemplate: React.Dispatch<any>;
  id: string;
}

const TemplateEditor = ({
  isDocumentPdfLoaded,
  template,
  setTemplate,
  id,
}: TemplateEditorPropsType) => {
  const [step, setStep] = useState<EditTemplateStep>("settings");
  const navigate = useRouter();

  return (
    <div className="col-span-12 lg:col-span-6 xl:col-span-5">
      <DocumentFlowFormContainer
        className="lg:h-[calc(100vh-80px)]"
        onSubmit={e => e.preventDefault()}
      >
        <Stepper
          currentStep={documentFlow[step].stepIndex}
          setCurrentStep={step => setStep(EditTemplateSteps[step - 1])}
        >
          <AddTemplateSettingsFormPartial
            key={template?.recipients?.length ?? 0}
            template={template}
            documentFlow={documentFlow.settings}
            recipients={template?.recipients ?? []}
            fields={template?.fields ?? []}
            onSubmit={async value => {
              await handleTemplateUpdate(template.id, value, template?.meta);

              const getTemplate = await getTemplateById(id);

              setTemplate(getTemplate);

              setStep("signers");
            }}
            isEnterprise={false}
            isDocumentPdfLoaded={isDocumentPdfLoaded}
          />

          <AddTemplatePlaceholderRecipientsFormPartial
            documentFlow={documentFlow.signers}
            recipients={template?.recipients ?? []}
            fields={template?.fields ?? []}
            templateDirectLink={template?.directLink}
            onSubmit={async value => {
              await handleRecipientUpdates(
                template.id,
                template.recipients,
                value
              );

              const getTemplate = await getTemplateById(id);

              setTemplate(getTemplate);

              setStep("fields");
            }}
            isEnterprise={false}
            isDocumentPdfLoaded={isDocumentPdfLoaded}
          />

          <AddTemplateFieldsFormPartial
            documentFlow={documentFlow.fields}
            recipients={template?.recipients ?? []}
            fields={template?.fields ?? []}
            onSubmit={async value => {
              await handleFieldUpdates(template.id, template.fields, value);

              const getTemplate = await getTemplateById(id);
              setTemplate(getTemplate);
              navigate.push("/business/templates");
            }}
            teamId={undefined}
          />
        </Stepper>
      </DocumentFlowFormContainer>
    </div>
  );
};

export default TemplateEditor;
