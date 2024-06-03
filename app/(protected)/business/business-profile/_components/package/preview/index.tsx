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
import { SearchableSelect } from "@/components/shared/searchable-select";

type propType = {
  groupedPackages: {
    package_group_id: string | null;
    package: getPackagesType["data"];
  }[];
  packagesGroups: getPackageGroupsType["data"];
  readOnly?: boolean;
};

const Preview = (prop: propType) => {
  const { groupedPackages, packagesGroups, readOnly = false } = prop;
  const [selectedPackage, setSelectedPackage] = useState<
    null | getPackagesType["data"]
  >(groupedPackages.length > 0 ? [groupedPackages[0].package![0]] : null);

  const clearSelection = () => {
    setSelectedPackage(null);
  };

  const packages: getPackagesType["data"] = groupedPackages.reduce(
    (prev, curr) => {
      prev = [...prev!, ...curr.package!];
      return prev;
    },
    [] as getPackagesType["data"]
  );

  const options =
    packages?.map(i => ({
      label: i.name!,
      value: i.id,
    })) ?? [];

  return (
    <div className="mt-2 xl:mt-4">
      <div className="block xl:hidden">
        <SearchableSelect
          options={options}
          onChange={value => {
            setSelectedPackage(packages?.filter(i => i.id === value) ?? []);
          }}
          placeholder="package"
          value={selectedPackage?.[0].id}
        />
      </div>
      <div className="mt-2  border border-input rounded-sm flex">
        <div className="hidden xl:block w-[250px] py-2 px-2 border-r border-input">
          {groupedPackages.length > 0 ? (
            <Accordion
              type="multiple"
              defaultValue={[groupedPackages[0].package_group_id as string]}
              className="w-full"
            >
              {groupedPackages.map(i =>
                i.package_group_id ? (
                  <AccordionItem
                    value={i.package_group_id}
                    key={i.package_group_id}
                  >
                    <AccordionTrigger className="whitespace-nowrap truncate	">
                      {
                        packagesGroups?.find(j => j.id === i.package_group_id)
                          ?.name
                      }
                    </AccordionTrigger>
                    <AccordionContent>
                      {i.package?.map(pack => (
                        <div key={pack.id} className="py-1">
                          <button
                            className={clsx({
                              "text-base underline-offset-1 hover:underline whitespace-nowrap truncate	w-full text-left	":
                                true,
                              "underline ": selectedPackage?.[0].id === pack.id,
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
                  <div key={i.package?.[0].id} className="py-1">
                    <button
                      className={clsx({
                        "text-base hover:underline hover:underline-offset-1 whitespace-nowrap truncate	w-full text-left":
                          true,
                        "underline ":
                          selectedPackage?.[0].id === i.package?.[0].id,
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
    </div>
  );
};

export default Preview;
