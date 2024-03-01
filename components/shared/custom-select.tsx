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
};

const CustomSelect = (props: propType) => {
  const { onChange, options, value } = props;
  return (
    <Select
      onValueChange={value => {
        onChange(value);
      }}
      value={value ?? ""}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a status" />
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
