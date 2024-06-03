"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "../ui/scroll-area";

type propType = {
  options: {
    label: string;
    value: string;
    className?: React.HTMLProps<HTMLElement>["className"];
  }[];
  onChange: (value: string) => void;
  value?: string;
  placeholder?: string;
  className?: string;
  contentClassName?: string;
};

export function SearchableSelect(props: propType) {
  const { options, onChange, value, placeholder } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex w-full">
            <div className="text-ellipsis overflow-hidden w-[calc(100%-24px)] text-left">
              {value
                ? options.find(option => option.value === value)?.label
                : `Select ${placeholder}...`}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[90dvw] w-full p-0">
        <Command className="max-h-[300px]">
          <CommandInput placeholder={`Search ${placeholder}...`} />
          <CommandEmpty>No {placeholder} found.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-[246px]">
              {options.map(option => {
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                );
              })}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
