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
    package_group_id: string | null;
    package: getPackagesType["data"];
  }[];
  packagesGroups: getPackageGroupsType["data"];
  readOnly?: boolean;
};

const Preview = (prop: propType) => {
  const [selectedPackage, setSelectedPackage] = useState<
    null | getPackagesType["data"]
  >(null);

  const { groupedPackages, packagesGroups, readOnly = false } = prop;

  const clearSelection = () => {
    setSelectedPackage(null);
  };

  return (
    <div className="mt-4 flex border border-input rounded-sm">
      <div className="w-[250px] py-2 px-2 border-r border-input">
        {groupedPackages.length > 0 ? (
          <Accordion type="multiple" className="w-full">
            {groupedPackages.map(i =>
              i.package_group_id ? (
                <AccordionItem
                  value={i.package_group_id as unknown as string}
                  key={i.package_group_id}
                >
                  <AccordionTrigger className="whitespace-nowrap truncate	">
                    {
                      packagesGroups?.find(
                        j => (j.id as unknown as string) === i.package_group_id
                      )?.name
                    }
                  </AccordionTrigger>
                  <AccordionContent>
                    {i.package?.map(pack => (
                      <div key={pack.id as unknown as string} className="py-1">
                        <button
                          className={clsx({
                            "text-base underline-offset-1 hover:underline whitespace-nowrap truncate	w-full text-left	":
                              true,
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
                      "text-base hover:underline hover:underline-offset-1 whitespace-nowrap truncate	w-full text-left":
                        true,
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
        ) : (
          <div className="text-center text-white font-medium text-base">
            {readOnly ? "No package exist" : "Create Packages"}
          </div>
        )}
      </div>
      <div className="flex-1">
        {selectedPackage ? (
          <SelectedPackage
            selectedPackage={selectedPackage}
            readOnly={readOnly}
            clearSelection={clearSelection}
          />
        ) : (
          <div className="text-center my-2 text-white font-medium text-base">
            {groupedPackages.length > 0 ? "Select package to preview." : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
