"use client";

import { useEffect, useState } from "react";

import { ChevronDown, ChevronUp, Trash } from "lucide-react";

import { validateDropdownField } from "@/lib/advanced-fields-validation/validate-dropdown";
import { type TDropdownFieldMeta as DropdownFieldMeta } from "@/lib/types/field-meta";
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

type DropdownFieldAdvancedSettingsProps = {
  fieldState: DropdownFieldMeta;
  handleFieldChange: (
    key: keyof DropdownFieldMeta,
    value: string | { value: string }[] | boolean
  ) => void;
  handleErrors: (errors: string[]) => void;
};

export const DropdownFieldAdvancedSettings = ({
  fieldState,
  handleFieldChange,
  handleErrors,
}: DropdownFieldAdvancedSettingsProps) => {
  const [showValidation, setShowValidation] = useState(false);
  const [values, setValues] = useState(
    fieldState.values ?? [{ value: "Option 1" }]
  );
  const [readOnly, setReadOnly] = useState(fieldState.readOnly ?? false);
  const [required, setRequired] = useState(fieldState.required ?? false);
  const [defaultValue, setDefaultValue] = useState(
    fieldState.defaultValue ?? "Option 1"
  );

  const addValue = () => {
    setValues([...values, { value: "New option" }]);
    handleFieldChange("values", [...values, { value: "New option" }]);
  };

  const removeValue = (index: number) => {
    if (values.length === 1) return;

    const newValues = [...values];
    newValues.splice(index, 1);
    setValues(newValues);
    handleFieldChange("values", newValues);
  };

  const handleToggleChange = (
    field: keyof DropdownFieldMeta,
    value: string | boolean
  ) => {
    const readOnly =
      field === "readOnly" ? Boolean(value) : Boolean(fieldState.readOnly);
    const required =
      field === "required" ? Boolean(value) : Boolean(fieldState.required);
    setReadOnly(readOnly);
    setRequired(required);

    const errors = validateDropdownField(undefined, {
      readOnly,
      required,
      values,
    });
    handleErrors(errors);

    handleFieldChange(field, value);
  };

  const handleValueChange = (index: number, newValue: string) => {
    const updatedValues = [...values];
    updatedValues[index].value = newValue;
    setValues(updatedValues);
    handleFieldChange("values", updatedValues);
  };

  useEffect(() => {
    const errors = validateDropdownField(undefined, {
      readOnly,
      required,
      values,
    });
    handleErrors(errors);
  }, [values]);

  useEffect(() => {
    setValues(fieldState.values ?? [{ value: "Option 1" }]);
  }, [fieldState.values]);

  useEffect(() => {
    setDefaultValue(fieldState.defaultValue ?? "Option 1");
  }, [fieldState.defaultValue]);

  return (
    <div className="text-dark flex flex-col gap-4">
      <div>
        <Label>Select default option</Label>
        <Select
          defaultValue={defaultValue}
          onValueChange={val => {
            setDefaultValue(val);
            handleFieldChange("defaultValue", val);
          }}
        >
          <SelectTrigger className="text-muted-foreground bg-background mt-2 w-full">
            <SelectValue
              defaultValue={defaultValue}
              placeholder="-- Select --"
            />
          </SelectTrigger>
          <SelectContent position="popper">
            {values.map((item, index) => (
              <SelectItem
                key={index}
                value={
                  item.value && item.value.length > 0
                    ? item.value.toString()
                    : String(index)
                }
              >
                {item.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center gap-2">
          <Switch
            className="bg-background"
            checked={fieldState.required}
            onCheckedChange={checked => handleToggleChange("required", checked)}
          />
          <Label>Required field</Label>
        </div>
        <div className="flex flex-row items-center gap-2">
          <Switch
            className="bg-background"
            checked={fieldState.readOnly}
            onCheckedChange={checked => handleToggleChange("readOnly", checked)}
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
          <span className="flex items-center">Dropdown options</span>
          {showValidation ? <ChevronUp /> : <ChevronDown />}
        </span>
      </Button>

      {showValidation && (
        <div>
          {values.map((value, index) => (
            <div key={index} className="mt-2 flex items-center gap-4">
              <Input
                className="w-1/2"
                value={value.value}
                onChange={e => handleValueChange(index, e.target.value)}
              />
              <button
                type="button"
                className="col-span-1 mt-auto inline-flex h-10 w-10 items-center  text-slate-500 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => removeValue(index)}
              >
                <Trash className="h-5 w-5" />
              </button>
            </div>
          ))}
          <Button
            className="bg-foreground/10 hover:bg-foreground/5 border-foreground/10 ml-9 mt-4 border"
            variant="outline"
            onClick={addValue}
          >
            Add another option
          </Button>
        </div>
      )}
    </div>
  );
};
