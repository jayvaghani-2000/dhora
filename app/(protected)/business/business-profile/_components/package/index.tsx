"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { PiPlus } from "react-icons/pi";
import NewPackage from "./new-package";

const Package = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="text-secondary-light-gray font-semibold text-base">
          Packages
        </div>
        <Button
          onClick={() => {
            setOpen(true);
          }}
          className="text-xs lg:text-sm p-2 h-fit lg:px-4 "
        >
          <PiPlus size={16} className="mr-2" />
          Create Package
        </Button>
      </div>

      <NewPackage open={open} setOpen={setOpen} />
    </div>
  );
};

export default Package;
