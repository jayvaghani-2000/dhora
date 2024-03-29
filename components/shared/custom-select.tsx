import { HTMLProps, ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type propType = {
  options: {
    label: ReactNode;
    value: string;
    className?: HTMLProps<HTMLElement>["className"];
  }[];
  onChange: (value: string) => void;
  value?: string;
  placeholder?: string;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  contentClassName?: string;
};

const CustomSelect = (props: propType) => {
  const {
    onChange,
    options,
    value,
    placeholder,
    onOpenChange,
    className = "w-full",
    contentClassName = "",
  } = props;
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
      <SelectTrigger className={cn("w-full ", className)}>
        <SelectValue placeholder={placeholder ?? "Select a status"} />
      </SelectTrigger>
      <SelectContent className={cn("max-w-[90dvw]", contentClassName)}>
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
