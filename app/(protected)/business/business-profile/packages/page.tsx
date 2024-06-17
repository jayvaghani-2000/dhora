import React from "react";
import Package from "../_components/package";
import { getPackages } from "@/actions/(protected)/business/packages/getPackages";
import { getPackageGroups } from "@/actions/(protected)/business/packages/getPackageGroups";
import { groupPackagesByGroupId } from "@/lib/common";

export default async function BusinessPackages() {
  const [packagesGroups, packages] = await Promise.all([
    await getPackageGroups(),
    await getPackages(),
  ]);

  const groupedPackages = groupPackagesByGroupId(packages.data);

  return (
    <Package
      packagesGroups={packagesGroups.data}
      groupedPackages={groupedPackages}
    />
  );
}
