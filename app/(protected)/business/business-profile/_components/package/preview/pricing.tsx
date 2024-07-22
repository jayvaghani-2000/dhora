import React from "react";
import SelectedPackage from "./selected-package";
import { formatAmount } from "@/lib/common";
import { packageSingleUnitTypes } from "@/actions/_utils/types.type";

const Pricing = (props: React.ComponentProps<typeof SelectedPackage>) => {
  const { selectedPackage } = props;
  const packageDetail = selectedPackage?.[0]!;

  const {
    deposit,
    deposit_type,
    fixed_priced,
    max_unit,
    min_unit,
    unit,
    unit_qty,
    unit_rate,
  } = packageDetail;

  return (
    <div className="px-3 pb-3">
      <div className=" text-white font-medium text-base">Pricing</div>
      {fixed_priced ? (
        <ul className="list-disc pl-5">
          <li>{unit_rate ? formatAmount(unit_rate) + " (Fix)" : "-"}</li>
        </ul>
      ) : (
        <>
          {unit ? (
            <ul className="list-disc pl-5">
              {unit_rate && unit_qty ? (
                <li>
                  {formatAmount(unit_rate)}
                  {unit_qty === 1
                    ? `/${packageSingleUnitTypes[unit!]}`
                    : `/${unit_qty} ${unit}`}
                </li>
              ) : null}
              {min_unit ? (
                <li>
                  Minimum {min_unit} {unit}
                </li>
              ) : null}
              {max_unit ? (
                <li>
                  Maximum {max_unit} {unit}
                </li>
              ) : null}
            </ul>
          ) : (
            <div>-</div>
          )}
        </>
      )}

      {deposit ? (
        <>
          <div className=" text-white font-medium text-base mt-4">Deposit</div>
          <ul className="list-disc pl-5">
            <li>
              {deposit_type === "fixed" ? formatAmount(deposit) : `${deposit}%`}
            </li>
          </ul>
        </>
      ) : null}
    </div>
  );
};

export default Pricing;
