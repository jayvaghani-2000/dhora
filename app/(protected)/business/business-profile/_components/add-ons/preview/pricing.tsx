import React from "react";
import SelectedAddOn from "./selected-add-on";
import { formatAmount } from "@/lib/common";
import { isNumber } from "lodash";

const Pricing = (props: React.ComponentProps<typeof SelectedAddOn>) => {
  const { selectedAddOn } = props;
  const addOnDetail = selectedAddOn?.[0]!;

  const { unit_rate, max_unit, unit_qty } = addOnDetail;

  return (
    <div className="px-3 pb-3">
      <div className=" text-white font-medium text-base">Pricing</div>

      <ul className="list-disc pl-5">
        <li>
          {formatAmount(unit_rate as number)}
          {unit_qty === 1 ? `/unit` : `/${unit_qty} unit`}
        </li>

        {isNumber(max_unit) && <li>Maximum {max_unit} unit</li>}
      </ul>
    </div>
  );
};

export default Pricing;
