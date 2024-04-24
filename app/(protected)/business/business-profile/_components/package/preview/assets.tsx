import React from "react";
import SelectedPackage from "./selected-package";

const Assets = (props: React.ComponentProps<typeof SelectedPackage>) => {
  const { selectedPackage } = props;
  const packageDetail = selectedPackage?.[0]!;
  return packageDetail.assets.length === 0 ? (
    <div className="text-center mt-2 text-white font-medium text-base">
      No assets to show.
    </div>
  ) : (
    <></>
  );
};

export default Assets;
