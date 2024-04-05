import React from "react";
import { me } from "@/actions/(auth)/me";
import BusinessDetailForm from "../../_components/business-detail-form";
import AssetsManagement from "./_components/assets-management";
import { getBusinessAssets } from "@/actions/(protected)/business/profile/assets/getBusinessAssets";

export default async function BusinessProfile() {
  const [user, assets] = await Promise.all([
    await me(),
    await getBusinessAssets(),
  ]);

  if (!user.success) {
    return <div className="text-center">Unable to fetch user details</div>;
  }

  return (
    <div className="flex flex-col gap-5">
      <BusinessDetailForm user={user.data} deletable={false} />
      <AssetsManagement assets={assets} />
    </div>
  );
}
