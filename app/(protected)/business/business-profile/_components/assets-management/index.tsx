"use client";
import React from "react";
import UploadAssets from "./upload-assets";
import { getBusinessAssetsType } from "@/actions/_utils/types.type";
import AssetsView from "@/components/shared/assets-view";

type propTypes = {
  assets: getBusinessAssetsType;
};

const AssetsManagement = (props: propTypes) => {
  return (
    <div>
      <div className="text-secondary-light-gray font-semibold text-base ">
        Multimedia
      </div>

      <div className="relative my-2 w-fit">
        <UploadAssets />
      </div>

      <AssetsView assets={props.assets.data ?? []} deletable />
    </div>
  );
};

export default AssetsManagement;
