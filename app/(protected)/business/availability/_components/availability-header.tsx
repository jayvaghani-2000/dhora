import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";

const AvailabilityHeader = () => {
  return (
    <div className="flex justify-between">
      <div>
        <span className="font-semibold">Amazon</span>
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex items-center space-x-2">
          <Label
            htmlFor={`set_as_default`}
            className="font-semibold cursor-pointer"
          >
            Set to Default
          </Label>
          <Switch id={`set_as_default`} onCheckedChange={checked => {}} />
        </div>
        <Separator orientation="vertical" className="w-0.5 h-8" />
        <Button variant="outline" className="p-1 h-[28px]" onClick={() => {}}>
          <RiDeleteBin6Line size={18} color="#b6b6b6" />
        </Button>
        <Separator orientation="vertical" className="w-0.5 h-8" />
        <Button>Save</Button>
      </div>
    </div>
  );
};

export default AvailabilityHeader;
