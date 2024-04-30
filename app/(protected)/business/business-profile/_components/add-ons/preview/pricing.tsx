import React from "react";
import SelectedAddOn from "./selected-add-on";
import { formatAmount } from "@/lib/common";

const Pricing = (props: React.ComponentProps<typeof SelectedAddOn>) => {
  const { selectedAddOn } = props;
  const addOnDetail = selectedAddOn?.[0]!;

  const { unit_rate, max_unit } = addOnDetail;

  return (
    <div className="px-3 pb-3">
      <div className=" text-white font-medium text-base">Pricing</div>

      <ul className="list-disc pl-5">
        <li>
          {formatAmount(unit_rate as number)}
          {`/unit`}
        </li>

        <li>Maximum {max_unit} unit</li>
      </ul>
    </div>
  );
};

export default Pricing;
