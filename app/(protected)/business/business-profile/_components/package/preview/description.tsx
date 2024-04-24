import React from "react";
import SelectedPackage from "./selected-package";
import RichEditor from "@/components/shared/rich-editor";

const Description = (props: React.ComponentProps<typeof SelectedPackage>) => {
  const { selectedPackage } = props;
  const packageDetail = selectedPackage?.[0]!;

  return (
    <div className="px-3">
      <RichEditor value={packageDetail.description ?? ""} readOnly />
    </div>
  );
};

export default Description;
