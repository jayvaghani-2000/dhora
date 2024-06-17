"use client";
import React from "react";
import { getBusinessDetailsType } from "@/actions/_utils/types.type";
import AssetsView from "@/components/shared/assets-view";

type propTypes = {
  assets: getBusinessDetailsType["data"]["assets"];
};

const Assets = (props: propTypes) => {
  return <AssetsView assets={props.assets!} />;
};

export default Assets;
