"use client";

import { createPortal } from "react-dom";

import { useFieldPageCoords } from "@/lib/client-only/hooks/use-field-page-coords";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "../card";
import { FRIENDLY_FIELD_TYPE } from "./types";
import { TAddTemplateFieldsFormSchema } from "../template-flow/add-template-fields.types";

export type ShowFieldItemProps = {
  field: TAddTemplateFieldsFormSchema["fields"][0];
  recipients: any;
};

export const ShowFieldItem = ({ field, recipients }: ShowFieldItemProps) => {
  const coords = useFieldPageCoords(field);

  const signerEmail =
    recipients.find((recipient: any) => recipient.id === field.recipient_id)
      ?.email ?? "";

  return createPortal(
    <div
      className={cn("pointer-events-none absolute z-10 opacity-75")}
      style={{
        top: `${coords.y}px`,
        left: `${coords.x}px`,
        height: `${coords.height}px`,
        width: `${coords.width}px`,
      }}
    >
      <Card className={cn("bg-background h-full w-full")}>
        <CardContent
          className={cn(
            "text-muted-foreground/50 flex h-full w-full flex-col items-center justify-center p-2"
          )}
        >
          {FRIENDLY_FIELD_TYPE[field.type]}

          <p className="text-muted-foreground/50 w-full truncate text-center text-xs">
            {signerEmail}
          </p>
        </CardContent>
      </Card>
    </div>,
    document.body
  );
};
