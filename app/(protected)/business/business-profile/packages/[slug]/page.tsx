import { getPackageDetails } from "@/actions/(protected)/business/packages/getPackageDetail";
import React from "react";
import EditPackage from "../../_components/package/edit-package";
import { getPackageGroups } from "@/actions/(protected)/business/packages/getPackageGroups";

type propType = { params: { slug: string }; searchParams: {} };

export default async function UpdatePackage(props: propType) {
  const [packageDetail, packagesGroups] = await Promise.all([
    await getPackageDetails(props.params.slug),
    await getPackageGroups(),
  ]);

  if (!packageDetail.success) {
    return <div className="text-center">Unable to fetch package details</div>;
  }

  return (
    <EditPackage
      packageDetail={packageDetail.data}
      packagesGroups={packagesGroups.data}
    />
  );
}
