"use client";

import { useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

import { validateNumberField } from "@/lib/advanced-fields-validation/validate-number";
import { type TNumberFieldMeta as NumberFieldMeta } from "@/lib/types/field-meta";
import { Button } from "../../button";
import { Input } from "../../input";
import { Label } from "../../label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../select";
import { Switch } from "../../switch";

import { numberFormatValues } from "./constants";

type NumberFieldAdvancedSettingsProps = {
  fieldState: NumberFieldMeta;
  handleFieldChange: (
    key: keyof NumberFieldMeta,
    value: string | boolean
  ) => void;
  handleErrors: (errors: string[]) => void;
};

export const NumberFieldAdvancedSettings = ({
  fieldState,
  handleFieldChange,
  handleErrors,
}: NumberFieldAdvancedSettingsProps) => {
  const [showValidation, setShowValidation] = useState(false);

  const handleInput = (
    field: keyof NumberFieldMeta,
    value: string | boolean
  ) => {
    const userValue = field === "value" ? value : fieldState.value || 0;
    const userMinValue =
      field === "minValue" ? Number(value) : Number(fieldState.minValue || 0);
    const userMaxValue =
      field === "maxValue" ? Number(value) : Number(fieldState.maxValue || 0);
    const readOnly =
      field === "readOnly" ? Boolean(value) : Boolean(fieldState.readOnly);
    const required =
      field === "required" ? Boolean(value) : Boolean(fieldState.required);
    const numberFormat =
      field === "numberFormat" ? String(value) : fieldState.numberFormat || "";

    const valueErrors = validateNumberField(String(userValue), {
      minValue: userMinValue,
      maxValue: userMaxValue,
      readOnly,
      required,
      numberFormat,
    });
    handleErrors(valueErrors);

    handleFieldChange(field, value);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label>Label</Label>
        <Input
          id="label"
          className="bg-background mt-2"
          placeholder="Label"
          value={fieldState.label}
          onChange={e => handleFieldChange("label", e.target.value)}
        />
      </div>
      <div>
        <Label className="mt-4">Placeholder</Label>
        <Input
          id="placeholder"
          className="bg-background mt-2"
          placeholder="Placeholder"
          value={fieldState.placeholder}
          onChange={e => handleFieldChange("placeholder", e.target.value)}
        />
      </div>
      <div>
        <Label className="mt-4">Value</Label>
        <Input
          id="value"
          className="bg-background mt-2"
          placeholder="Value"
          value={fieldState.value}
          onChange={e => handleInput("value", e.target.value)}
        />
      </div>
      <div>
        <Label>Number format</Label>
        <Select
          value={fieldState.numberFormat}
          onValueChange={val => handleInput("numberFormat", val)}
        >
          <SelectTrigger className="text-muted-foreground bg-background mt-2 w-full">
            <SelectValue placeholder="Field format" />
          </SelectTrigger>
          <SelectContent position="popper">
            {numberFormatValues.map((item, index) => (
              <SelectItem key={index} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-2 flex flex-col gap-4">
        <div className="flex flex-row items-center gap-2">
          <Switch
            className="bg-background"
            checked={fieldState.required}
            onCheckedChange={checked => handleInput("required", checked)}
          />
          <Label>Required field</Label>
        </div>
        <div className="flex flex-row items-center gap-2">
          <Switch
            className="bg-background"
            checked={fieldState.readOnly}
            onCheckedChange={checked => handleInput("readOnly", checked)}
          />
          <Label>Read only</Label>
        </div>
      </div>
      <Button
        className="bg-foreground/10 hover:bg-foreground/5 border-foreground/10 mt-2 border"
        variant="outline"
        onClick={() => setShowValidation(prev => !prev)}
      >
        <span className="flex w-full flex-row justify-between">
          <span className="flex items-center">Validation</span>
          {showValidation ? <ChevronUp /> : <ChevronDown />}
        </span>
      </Button>
      {showValidation && (
        <div className="mb-4 flex flex-row gap-x-4">
          <div className="flex flex-col">
            <Label className="mt-4">Min</Label>
            <Input
              id="minValue"
              className="bg-background mt-2"
              placeholder="E.g. 0"
              value={fieldState.minValue}
              onChange={e => handleInput("minValue", e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <Label className="mt-4">Max</Label>
            <Input
              id="maxValue"
              className="bg-background mt-2"
              placeholder="E.g. 100"
              value={fieldState.maxValue}
              onChange={e => handleInput("maxValue", e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
