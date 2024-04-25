import React from "react";
import { me } from "@/actions/(auth)/me";
import { getBusinessAssets } from "@/actions/(protected)/business/assets/getBusinessAssets";
import Assets from "./_components/assets";
import BusinessDetails from "./_components/business-details";
import Preview from "./_components/package/preview";
import { groupPackagesByGroupId } from "@/lib/common";
import { getPackageGroups } from "@/actions/(protected)/business/packages/getPackageGroups";
import { getPackages } from "@/actions/(protected)/business/packages/getPackages";

export default async function BusinessProfile() {
  const [user, assets, packagesGroups, packages] = await Promise.all([
    await me(),
    await getBusinessAssets(),
    await getPackageGroups(),
    await getPackages(),
  ]);

  const groupedPackages = groupPackagesByGroupId(packages.data);

  if (!user.success) {
    return <div className="text-center">Unable to fetch user details</div>;
  }

  return (
    <div className="flex flex-col gap-5">
      <Assets assets={assets} />

      <BusinessDetails user={user.data} />
      <div>
        <div className="text-secondary-light-gray font-semibold text-base">
          Packages
        </div>
        <Preview
          packagesGroups={packagesGroups.data}
          groupedPackages={groupedPackages}
          readOnly
        />
      </div>
    </div>
  );
}
