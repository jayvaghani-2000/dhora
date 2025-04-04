import { ZCheckboxFieldMeta } from "@/lib/types/field-meta";
import type { TCheckboxFieldMeta } from "@/lib/types/field-meta";
import { Checkbox } from "../../checkbox";
import { Label } from "../../label";

import { FieldIcon } from "../field-icon";
import type { TDocumentFlowFormSchema } from "../types";

type Field = TDocumentFlowFormSchema["fields"][0];

export type CheckboxFieldProps = {
  field: Field;
};

export const CheckboxField = ({ field }: CheckboxFieldProps) => {
  let parsedFieldMeta: TCheckboxFieldMeta | undefined = undefined;
  if (field.fieldMeta) {
    parsedFieldMeta = ZCheckboxFieldMeta.parse(field.fieldMeta);
  }

  if (
    parsedFieldMeta &&
    (!parsedFieldMeta.values || parsedFieldMeta.values.length === 0)
  ) {
    return (
      <FieldIcon
        fieldMeta={field.fieldMeta}
        type={field.type}
        signerEmail={field.signerEmail}
      />
    );
  }

  return (
    <div className="flex flex-col gap-y-2">
      {!parsedFieldMeta?.values ? (
        <FieldIcon
          fieldMeta={field.fieldMeta}
          type={field.type}
          signerEmail={field.signerEmail}
        />
      ) : (
        parsedFieldMeta.values.map(
          (item: { value: string; checked: boolean }, index: number) => (
            <div key={index} className="flex items-center gap-x-1.5">
              <Checkbox
                className="h-4 w-4"
                id={`checkbox-${index}`}
                checked={item.checked}
              />
              <Label
                className="text-primary-black"
                htmlFor={`checkbox-${index}`}
              >
                {item.value}
              </Label>
            </div>
          )
        )
      )}
    </div>
  );
};
