"use client";
import React from "react";
import { getBusinessDetailsType } from "@/actions/_utils/types.type";
import AssetsView from "@/components/shared/assets-view";

type propTypes = {
  assets: getBusinessDetailsType["data"]["assets"];
  deletable?: boolean;
};

const Assets = (props: propTypes) => {
  return <AssetsView {...props} />;
};

export default Assets;
