"use client";
import { getPackageDetailsType } from "@/actions/_utils/types.type";
import BackButton from "@/components/shared/back-button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

type propType = { packageDetail: getPackageDetailsType["data"] };

const EditPackage = (props: propType) => {
  const { packageDetail } = props;

  const packageInfo = packageDetail!;

  return (
    <Tabs defaultValue="description">
      <BackButton to="/business/business-profile/packages" />
      <div className="flex relative gap-4 items-center mt-2">
        <div className="text-white font-medium text-base">
          {packageInfo.name}
        </div>
        <TabsList className="overflow-auto flex items-start justify-start max-w-full w-fit scrollbar-hide">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>
      </div>
    </Tabs>
  );
};

export default EditPackage;
