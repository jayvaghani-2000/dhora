import { getPackageDetails } from "@/actions/(protected)/business/packages/getPackageDetail";
import React from "react";
import EditPackage from "../../_components/package/edit-package";

type propType = { params: { slug: string }; searchParams: {} };

export default async function Package(props: propType) {
  const packageDetail = await getPackageDetails(props.params.slug);

  if (!packageDetail.success) {
    return <div className="text-center">Unable to fetch package details</div>;
  }

  return <EditPackage packageDetail={packageDetail.data} />;
}
