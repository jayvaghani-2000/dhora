"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { ScrollArea } from "../ui/scroll-area";



type optionType = {
  label: string;
  value: string;
  className?: React.HTMLProps<HTMLElement>["className"];
};

type propType = {
  options: optionType[];
  onChange: (value: string[]) => void;
  value?: string[];
  placeholder?: string;
  className?: string;
  contentClassName?: string;
};

function MultiSelect(prop: propType) {
  const { options, onChange, placeholder, value = [] } = prop;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);

  const selected = options.filter(i => value.includes(i.value));
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback(
    (option: optionType["value"]) => {
      onChange(value.filter(s => s !== option));
    },
    [value]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          const newSelected = [...value];
          newSelected.pop();
          onChange(newSelected);
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [value]
  );

  const selectables = options.filter(option => !selected.includes(option));

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group border border-input px-3 py-[5px] lg:py-2 text-sm ring-offset-background rounded-md  ">
        <div className="flex gap-1 flex-wrap">
          {selected.map(option => {
            return (
              <Badge key={option.value} variant="secondary">
                {option.label}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none "
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      handleUnselect(option.value);
                    }
                  }}
                  onMouseDown={e => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(option.value)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={`Select ${placeholder}...`}
            className=" bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-0.5 z-50">
        {open && selectables.length > 0 ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              <ScrollArea className="h-[200px]">
                {selectables.map(option => {
                  return (
                    <CommandItem
                      key={option.value}
                      onMouseDown={e => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={id => {
                        setInputValue("");
                        onChange([...value, option.value]);
                      }}
                      className={"cursor-pointer"}
                    >
                      {option.label}
                    </CommandItem>
                  );
                })}
              </ScrollArea>
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
}

export default MultiSelect;
