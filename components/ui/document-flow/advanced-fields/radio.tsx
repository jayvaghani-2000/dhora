import { ZRadioFieldMeta } from "@/lib/types/field-meta";
import type { TRadioFieldMeta } from "@/lib/types/field-meta";
import { Label } from "../../label";
import { RadioGroup, RadioGroupItem } from "../../radio-group";

import { FieldIcon } from "../field-icon";
import type { TDocumentFlowFormSchema } from "../types";

type Field = TDocumentFlowFormSchema["fields"][0];

export type RadioFieldProps = {
  field: Field;
};

export const RadioField = ({ field }: RadioFieldProps) => {
  let parsedFieldMeta: TRadioFieldMeta | undefined = undefined;

  if (field.fieldMeta) {
    parsedFieldMeta = ZRadioFieldMeta.parse(field.fieldMeta);
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
        <RadioGroup>
          {parsedFieldMeta.values?.map((item, index) => (
            <div key={index} className="flex items-center gap-x-1.5">
              <RadioGroupItem
                className="pointer-events-none"
                value={item.value}
                id={`option-${index}`}
                checked={item.checked}
              />
              <Label className="text-primary-black" htmlFor={`option-${index}`}>
                {item.value}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  );
};
