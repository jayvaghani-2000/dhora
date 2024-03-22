import { Checkbox } from "@/components/ui/checkbox";
import { weekDays } from "@/lib/constant";
import { daysCode } from "@/lib/enum";
import React, { useState } from "react";
import { IoMdCopy } from "react-icons/io";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type propType = {
  parentSlot: number;
  copySlots: (sourceDayCode: number, targetSlots: number[]) => void;
};

const CopySlots = (prop: propType) => {
  const { parentSlot, copySlots } = prop;
  const [open, setOpen] = useState(false);
  const [copySlotsTo, setCopySlotsTo] = useState([parentSlot]);

  const handleCloseSlot = () => {
    setOpen(false);
    setCopySlotsTo([parentSlot]);
  };

  return (
    <Popover
      open={open}
      onOpenChange={value => {
        if (value) {
          setOpen(value);
        } else {
          handleCloseSlot();
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline">
          <IoMdCopy size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[170px] p-0">
        <div className="p-2">
          <span className="text-xs uppercase font-semibold">Copy times to</span>
          <div className="flex flex-col gap-3 mt-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor={`select_all_days`}
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize flex-1"
              >
                Select all
              </label>
              <Checkbox
                id={`select_all_days`}
                checked={copySlotsTo.length === 7}
                onCheckedChange={checked => {
                  if (checked) {
                    setCopySlotsTo(weekDays.map(i => daysCode[i]));
                  } else {
                    setCopySlotsTo([parentSlot]);
                  }
                }}
              />
            </div>
            {weekDays.map((i: keyof typeof daysCode) => {
              return (
                <div key={i} className="flex items-center justify-between">
                  <label
                    htmlFor={`${i}select`}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize flex-1"
                  >
                    {i}
                  </label>
                  <Checkbox
                    id={`${i}select`}
                    disabled={daysCode[i] === parentSlot}
                    checked={copySlotsTo.includes(daysCode[i])}
                    onCheckedChange={checked => {
                      if (checked) {
                        setCopySlotsTo(prev => [...prev, daysCode[i]]);
                      } else {
                        setCopySlotsTo(prev =>
                          prev.filter(j => j !== daysCode[i])
                        );
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-2 border-t p-2 border-divider flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              handleCloseSlot();
            }}
          >
            cancel
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              copySlots(parentSlot, copySlotsTo);
              handleCloseSlot();
            }}
          >
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CopySlots;
