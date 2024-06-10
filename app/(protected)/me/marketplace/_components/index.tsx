"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import BusinessCard from "./business-card";
import { businessTypes, getBusinessesType } from "@/actions/_utils/types.type";
import Filters from "./filters";
import { debounce } from "lodash";
import { getBusinesses } from "@/actions/(protected)/customer/businesses/getBusinesses";
import { Button } from "@/components/ui/button";

type propsType = {
  businesses: getBusinessesType["data"];
};

export type filterType = {
  category: string;
  city: string;
  sort: string;
  search: string;
  current_page: number;
};

const MarketPlace = (props: propsType) => {
  const { businesses } = props;
  const [filter, setFilter] = useState<filterType>({
    category: "",
    city: "",
    sort: "",
    search: "",
    current_page: 1,
  });
  const [businessList, setBusinessList] = useState(businesses);

  console.log(businessList.data)

  const getFilteredBusiness = 
    debounce(async () => {
      const data = await getBusinesses({ filter: filter });
      setBusinessList(prev => ({
        ...prev,
        data: filter.current_page === 1 ? data.data.data : [...prev.data, ...data.data.data],
      }));
    }, 500)
  
  useEffect(() => {
    getFilteredBusiness();
    return () => {
      getFilteredBusiness.cancel();
    };
  }, [filter]);

  return (
    <div className="flex gap-5 flex-col">
      <Filters filter={filter} setFilter={setFilter} />
      {businessList.data.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(350px,1fr))]">
          {businessList.data.map(business => (
            <BusinessCard key={business.id} business={business} />
          ))}
          {filter.current_page < businessList.pages.total_pages && (
            <Button
              variant="secondary"
              className="w-fit mx-auto"
              onClick={() => {
                setFilter(prev => ({
                  ...prev,
                  current_page: prev.current_page + 1,
                }));
              }}
            >
              Load More
            </Button>
          )}
        </div>
      ) : (
        <div className="text-center">No businesses found</div>
      )}
    </div>
  );
};

export default MarketPlace;
