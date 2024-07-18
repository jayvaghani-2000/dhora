"use client";
import React, { useState } from "react";
import UploadAssets from "./upload-assets";
import { getPackageAssetsType } from "@/actions/_utils/types.type";
import EditPackage from ".";
import AssetsView from "@/components/shared/assets-view";

const AssetsManagement = (props: React.ComponentProps<typeof EditPackage>) => {
  const { packageDetail } = props;
  const packageInfo = packageDetail!;
  const { assets: savedAssets } = packageInfo;

  const [assets, setAssets] = useState<getPackageAssetsType["data"]>(
    savedAssets ?? []
  );

  return (
    <div>
      <div className="relative mt-4 mb-2 w-fit">
        <UploadAssets setAssets={setAssets} />
      </div>
      {assets ? <AssetsView assets={assets} deletable/> : null}
    </div>
  );
};

export default AssetsManagement;
