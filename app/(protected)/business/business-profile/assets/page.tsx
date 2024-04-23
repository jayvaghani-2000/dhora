import React from "react";
import { getBusinessAssets } from "@/actions/(protected)/business/assets/getBusinessAssets";
import AssetsManagement from "../_components/assets-management";

export default async function BusinessAssets() {
  const [assets] = await Promise.all([await getBusinessAssets()]);

  return (
    <div className="flex flex-col gap-5">
      <AssetsManagement assets={assets} />
    </div>
  );
}
