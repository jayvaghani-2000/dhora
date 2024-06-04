import { getBusinesses } from "@/actions/(protected)/customer/businesses/getBusinesses";
import React from "react";
import MarketPlace from "./_components";

export default async function MarketplacePage() {
  const businesses = await getBusinesses();


  return businesses.success ? (
    <MarketPlace businesses={businesses.data} />
  ) : (
    <div className="text-center">Unable to fetch businesses</div>
  );
}
