"use client";
import { getAddOnGroupsType, getAddOnsType } from "@/actions/_utils/types.type";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useState } from "react";
import clsx from "clsx";
import SelectedAddOn from "./selected-add-on";

type propType = {
  addOnGroups: getAddOnGroupsType["data"];
  groupedAddOns: {
    add_on_group_id: string | null;
    addOn: getAddOnsType["data"];
  }[];

  readOnly?: boolean;
};

const Preview = (prop: propType) => {
  const { groupedAddOns, addOnGroups, readOnly = false } = prop;
  const [selectedAddOn, setSelectedAddOn] = useState<
    null | getAddOnsType["data"]
  >(groupedAddOns.length > 0 ? [groupedAddOns[0].addOn![0]] : null);

  const clearSelection = () => {
    setSelectedAddOn(null);
  };

  return (
    <div className="mt-4 flex border border-input rounded-sm">
      <div className="w-[250px] py-2 px-2 border-r border-input">
        {groupedAddOns.length > 0 ? (
          <Accordion
            type="multiple"
            defaultValue={[
              groupedAddOns[0].add_on_group_id as unknown as string,
            ]}
            className="w-full"
          >
            {groupedAddOns.map(i =>
              i.add_on_group_id ? (
                <AccordionItem
                  value={i.add_on_group_id as unknown as string}
                  key={i.add_on_group_id}
                >
                  <AccordionTrigger className="whitespace-nowrap truncate	">
                    {
                      addOnGroups?.find(
                        j => (j.id as unknown as string) === i.add_on_group_id
                      )?.name
                    }
                  </AccordionTrigger>
                  <AccordionContent>
                    {i.addOn?.map(j => (
                      <div key={j.id as unknown as string} className="py-1">
                        <button
                          className={clsx({
                            "text-base underline-offset-1 hover:underline whitespace-nowrap truncate	w-full text-left	":
                              true,
                            "underline ":
                              (selectedAddOn?.[0].id as unknown as string) ===
                              (j.id as unknown as string),
                          })}
                          onClick={() => {
                            setSelectedAddOn([j]);
                          }}
                        >
                          {j.name}
                        </button>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <div
                  key={i.addOn?.[0].id as unknown as string}
                  className="py-1"
                >
                  <button
                    className={clsx({
                      "text-base hover:underline hover:underline-offset-1 whitespace-nowrap truncate	w-full text-left":
                        true,
                      "underline ":
                        (selectedAddOn?.[0].id as unknown as string) ===
                        (i.addOn?.[0].id as unknown as string),
                    })}
                    onClick={() => {
                      setSelectedAddOn(i.addOn);
                    }}
                  >
                    {i.addOn?.[0].name}
                  </button>
                </div>
              )
            )}
          </Accordion>
        ) : (
          <div className="text-center text-white font-medium text-base">
            {readOnly ? "No add on exist" : "Create Add Ons"}
          </div>
        )}
      </div>
      <div className="flex-1">
        {selectedAddOn ? (
          <SelectedAddOn
            selectedAddOn={selectedAddOn}
            readOnly={readOnly}
            clearSelection={clearSelection}
          />
        ) : (
          <div className="text-center my-2 text-white font-medium text-base">
            {groupedAddOns.length > 0 ? "Select add on to preview." : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
