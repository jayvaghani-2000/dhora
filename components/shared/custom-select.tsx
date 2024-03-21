import React, { HTMLProps } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type propType = {
  options: {
    label: string;
    value: string;
    className?: HTMLProps<HTMLElement>["className"];
  }[];
  onChange: (value: string) => void;
  value?: string;
  placeholder?: string;
  onOpenChange?: (open: boolean) => void;
};

const CustomSelect = (props: propType) => {
  const { onChange, options, value, placeholder, onOpenChange } = props;
  return (
    <Select
      onValueChange={value => {
        onChange(value);
      }}
      value={value ?? ""}
      onOpenChange={open => {
        onOpenChange && onOpenChange(open);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder ?? "Select a status"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map(i => (
            <SelectItem key={i.value} value={i.value} className={i.className}>
              {i.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;
