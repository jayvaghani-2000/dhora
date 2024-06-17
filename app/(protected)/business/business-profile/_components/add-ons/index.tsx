"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { PiPlus } from "react-icons/pi";
import { getAddOnGroupsType, getAddOnsType } from "@/actions/_utils/types.type";
import NewAddOn from "./new-add-on";
import NewAddOnGroup from "./new-group";
import Preview from "./preview";

type propType = {
  addOnGroups: getAddOnGroupsType["data"];
  groupedAddOns: {
    add_on_group_id: string | null;
    addOn: getAddOnsType["data"];
  }[];
};

const AddOns = (props: propType) => {
  const { addOnGroups, groupedAddOns } = props;
  const [open, setOpen] = useState(false);
  const [openNewGroup, setOpenNewGroup] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="text-secondary-light-gray font-semibold text-base">
          Add Ons
        </div>
        <div className="flex gap-2 items-center">
          <Button
            onClick={() => {
              setOpenNewGroup(true);
            }}
            className="text-xs lg:text-sm p-2 h-fit lg:px-4 "
          >
            Create Group
          </Button>
          <Button
            onClick={() => {
              setOpen(true);
            }}
            className="text-xs lg:text-sm p-2 h-fit lg:px-4 "
          >
            <PiPlus size={16} className="mr-2" />
            New
          </Button>
        </div>
      </div>

      <Preview addOnGroups={addOnGroups} groupedAddOns={groupedAddOns} />

      <NewAddOn open={open} setOpen={setOpen} addOnGroups={addOnGroups} />
      <NewAddOnGroup open={openNewGroup} setOpen={setOpenNewGroup} />
    </div>
  );
};

export default AddOns;
