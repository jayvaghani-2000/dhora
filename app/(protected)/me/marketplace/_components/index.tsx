"use client";
import React from "react";
import BusinessCard from "./business-card";
import { getBusinessesType } from "@/actions/_utils/types.type";
import Filters from "./filters";

type propsType = {
  businesses: getBusinessesType["data"];
};

const MarketPlace = (props: propsType) => {
  const { businesses } = props;

  return (
    <div className="flex gap-5 flex-col">
      <Filters />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(350px,1fr))]">
        {businesses!.data.map(business => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
    </div>
  );
};

export default MarketPlace;
