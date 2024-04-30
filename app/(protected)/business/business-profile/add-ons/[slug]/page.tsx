import React from "react";
import EditAddOn from "../../_components/add-ons/edit-add-on";
import { getAddOnDetails } from "@/actions/(protected)/business/add-ons/getAddOnDetails";
import { getAddOnGroups } from "@/actions/(protected)/business/add-ons/getAddOnGroups";

type propType = { params: { slug: string }; searchParams: {} };

export default async function UpdateAddOn(props: propType) {
  const [addOnDetail, addOnGroups] = await Promise.all([
    await getAddOnDetails(props.params.slug),
    await getAddOnGroups(),
  ]);

  if (!addOnDetail.success) {
    return <div className="text-center">Unable to fetch add on details</div>;
  }

  return (
    <EditAddOn addOnDetail={addOnDetail.data} addOnGroups={addOnGroups.data} />
  );
}
