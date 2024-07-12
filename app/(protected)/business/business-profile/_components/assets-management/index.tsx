"use client";
import React, { useState } from "react";
import UploadAssets from "./upload-assets";
import { getBusinessAssetsType } from "@/actions/_utils/types.type";
import AssetsView from "@/components/shared/assets-view";

type propTypes = {
  assets: getBusinessAssetsType;
};

const AssetsManagement = (props: propTypes) => {
  const [assets, setAssets] = useState<getBusinessAssetsType["data"]>(
    props.assets.data ?? []
  );

  return (
    <div>
      <div className="text-secondary-light-gray font-semibold text-base ">
        Multimedia
      </div>

      <div className="relative my-2 w-fit">
        <UploadAssets setAssets={setAssets} />
      </div>

      <AssetsView assets={assets!} />
    </div>
  );
};

export default AssetsManagement;
