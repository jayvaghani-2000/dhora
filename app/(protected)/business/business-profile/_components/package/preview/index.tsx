"use client";
import {
  getPackageGroupsType,
  getPackagesType,
} from "@/actions/_utils/types.type";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import SelectedPackage from "./selected-package";
import { useState } from "react";
import clsx from "clsx";

type propType = {
  groupedPackages: {
    package_groups_id: string | null;
    package: getPackagesType["data"];
  }[];
  packagesGroups: getPackageGroupsType["data"];
};

const Preview = (prop: propType) => {
  const [selectedPackage, setSelectedPackage] = useState<
    null | getPackagesType["data"]
  >(null);

  const { groupedPackages, packagesGroups } = prop;

  return (
    <div className="mt-4 flex border border-input rounded-sm">
      <div className="w-[250px] py-2 px-2 border-r border-input">
        <Accordion type="multiple" className="w-full">
          {groupedPackages.map(i =>
            i.package_groups_id ? (
              <AccordionItem
                value={i.package_groups_id as unknown as string}
                key={i.package_groups_id}
              >
                <AccordionTrigger>
                  {
                    packagesGroups?.find(
                      j => (j.id as unknown as string) === i.package_groups_id
                    )?.name
                  }
                </AccordionTrigger>
                <AccordionContent>
                  {i.package?.map(pack => (
                    <div key={pack.id as unknown as string} className="py-1">
                      <button
                        className={clsx({
                          "text-base underline-offset-1 hover:underline ": true,
                          "underline ":
                            (selectedPackage?.[0].id as unknown as string) ===
                            (pack.id as unknown as string),
                        })}
                        onClick={() => {
                          setSelectedPackage([pack]);
                        }}
                      >
                        {pack.name}
                      </button>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ) : (
              <div
                key={i.package?.[0].id as unknown as string}
                className="py-1"
              >
                <button
                  className={clsx({
                    "text-base hover:underline hover:underline-offset-1": true,
                    "underline ":
                      (selectedPackage?.[0].id as unknown as string) ===
                      (i.package?.[0].id as unknown as string),
                  })}
                  onClick={() => {
                    setSelectedPackage(i.package);
                  }}
                >
                  {i.package?.[0].name}
                </button>
              </div>
            )
          )}
        </Accordion>
      </div>
      <div className="flex-1">
        {selectedPackage ? (
          <SelectedPackage selectedPackage={selectedPackage} />
        ) : (
          <div className="text-center mt-2 text-white font-medium text-base">
            Select package to preview.
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
