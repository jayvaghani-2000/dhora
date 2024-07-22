"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { PiPlus } from "react-icons/pi";
import NewPackage from "./new-package";
import NewPackageGroup from "./new-group";
import {
  getPackageGroupsType,
  getPackagesType,
} from "@/actions/_utils/types.type";
import Preview from "./preview";

type propType = {
  packagesGroups: getPackageGroupsType["data"];
  groupedPackages: {
    package_group_id: string | null;
    package: getPackagesType["data"];
  }[];
};

const Package = (props: propType) => {
  const { packagesGroups, groupedPackages } = props;
  const [open, setOpen] = useState(false);
  const [openNewGroup, setOpenNewGroup] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="text-secondary-light-gray font-semibold text-base">
          Packages
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

      <Preview
        groupedPackages={groupedPackages}
        packagesGroups={packagesGroups}
        assetsDeletable={true}
      />

      <NewPackage
        open={open}
        setOpen={setOpen}
        packagesGroups={packagesGroups}
      />
      <NewPackageGroup open={openNewGroup} setOpen={setOpenNewGroup} />
    </div>
  );
};

export default Package;
