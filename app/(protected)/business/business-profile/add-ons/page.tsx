import React from "react";
import { getAddOnGroups } from "@/actions/(protected)/business/add-ons/getAddOnGroups";
import { getAddOns } from "@/actions/(protected)/business/add-ons/getAddOns";
import { groupAddOnsByGroupId } from "@/lib/common";
import AddOns from "../_components/add-ons";

export default async function BusinessAddOns() {
  const [addOnGroups, addOns] = await Promise.all([
    await getAddOnGroups(),
    await getAddOns(),
  ]);

  const groupedAddOns = groupAddOnsByGroupId(addOns.data);

  return (
    <AddOns addOnGroups={addOnGroups.data} groupedAddOns={groupedAddOns} />
  );
}
