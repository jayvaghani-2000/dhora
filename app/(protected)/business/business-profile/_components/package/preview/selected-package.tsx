"use client";
import { getPackagesType } from "@/actions/_utils/types.type";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Description from "./description";
import Assets from "./assets";
import Pricing from "./pricing";
import { MdOutlineModeEdit } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type propType = {
  selectedPackage: getPackagesType["data"];
};

const SelectedPackage = (prop: propType) => {
  const { selectedPackage } = prop;
  const router = useRouter();
  const packageDetail = selectedPackage?.[0]!;

  return (
    <Tabs defaultValue="description">
      <div className="flex relative justify-between items-center gap-5 bg-muted">
        <div className="pl-3 pr-1 text-white font-medium text-base">
          {packageDetail.name}
        </div>
        <TabsList className="absolute overflow-auto flex items-start justify-start max-w-full w-fit scrollbar-hide   top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>
        <div>
          <Button
            variant="ghost"
            onClick={e => {
              router.push(`packages/${packageDetail.id}`);
            }}
          >
            <MdOutlineModeEdit color="#fff" className="h-6 w-6" />
          </Button>
        </div>
      </div>
      <TabsContent value="description">
        <Description {...prop} />
      </TabsContent>
      <TabsContent value="assets">
        <Assets {...prop} />
      </TabsContent>
      <TabsContent value="pricing">
        <Pricing {...prop} />
      </TabsContent>
    </Tabs>
  );
};

export default SelectedPackage;
