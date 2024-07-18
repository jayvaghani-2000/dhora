import React from "react";
import SelectedPackage from "./selected-package";
import AssetsView from "@/components/shared/assets-view";

const Assets = (props: React.ComponentProps<typeof SelectedPackage>) => {
  const { selectedPackage, readOnly } = props;
  const packageDetail = selectedPackage?.[0]!;
  return packageDetail.assets.length === 0 ? (
    <div className="text-center mt-2 text-white font-medium text-base">
      No assets to show.
    </div>
  ) : (
    <div className="px-3 pt-2 pb-4">
      <AssetsView assets={packageDetail.assets!} deletable={!readOnly} />
    </div>
  );
};

export default Assets;
