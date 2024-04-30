import React from "react";
import SelectedAddOn from "./selected-add-on";
import RichEditor from "@/components/shared/rich-editor";
import { formatAmount } from "@/lib/common";

const Description = (props: React.ComponentProps<typeof SelectedAddOn>) => {
  const { selectedAddOn } = props;
  const addOnDetail = selectedAddOn?.[0]!;

  const { description, unit_rate } = addOnDetail;

  return (
    <div className={"px-3  h-full pb-14"}>
      <RichEditor value={description ?? ""} readOnly readOnlyClass="" />

      <div className="bg-muted h-10 absolute left-0 right-0 bottom-0 pt-2 pr-3 text-right">
        <div className=" text-white font-medium text-base">
          Starting from {formatAmount(unit_rate!)}
          {`/unit`}
        </div>
      </div>
    </div>
  );
};

export default Description;
