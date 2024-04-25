import React from "react";
import SelectedPackage from "./selected-package";
import RichEditor from "@/components/shared/rich-editor";
import { formatAmount } from "@/lib/common";
import { packageSingleUnitTypes } from "@/actions/_utils/types.type";

const Description = (props: React.ComponentProps<typeof SelectedPackage>) => {
  const { selectedPackage } = props;
  const packageDetail = selectedPackage?.[0]!;

  const { fixed_priced, unit, unit_rate } = packageDetail;

  return (
    <div className="px-3 h-full">
      <RichEditor value={packageDetail.description ?? ""} readOnly />

      {fixed_priced || (unit && unit_rate) ? (
        <div className="bg-muted h-10 absolute left-0 right-0 bottom-0 pt-2 pr-3 text-right">
          {fixed_priced ? (
            <div className=" text-white font-medium text-base">
              {unit_rate ? formatAmount(unit_rate) + " (Fix)" : "-"}
            </div>
          ) : (
            <div className=" text-white font-medium text-base">
              Starting from {formatAmount(unit_rate!)}
              {`/${packageSingleUnitTypes[unit!]}`}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Description;
