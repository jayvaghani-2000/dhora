"use client";
import React from "react";
import { getBusinessAssetsType } from "@/actions/_utils/types.type";
import AssetsView from "@/components/shared/assets-view";

type propTypes = {
  assets: getBusinessAssetsType;
};

const Assets = (props: propTypes) => {
  return <AssetsView assets={props.assets.data!} />;
};

export default Assets;
