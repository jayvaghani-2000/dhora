import React from "react";
import { me } from "@/actions/(auth)/me";
import Assets from "@/app/(protected)/business/business-profile/_components/assets";
import BusinessDetails from "@/app/(protected)/business/business-profile/_components/business-details";
import Preview from "@/app/(protected)/business/business-profile/_components/package/preview";
import { groupPackagesByGroupId, groupAddOnsByGroupId } from "@/lib/common";
import AddOnPreview from "@/app/(protected)/business/business-profile/_components/add-ons/preview";
import ScheduleCall from "@/app/(protected)/business/business-profile/_components/schedule-call";
import { getBusinessDetails } from "@/actions/(protected)/business/getBusinessDetails";
import { Metadata } from "next";
import Reviews from "../_components/reviews";

type propType = { params: { slug: string } };

export async function generateMetadata({
  params,
}: propType): Promise<Metadata> {
  const businessDetails = await getBusinessDetails(params.slug);

  if (businessDetails.success) {
    return {
      title: businessDetails.data?.name,
      description: businessDetails.data?.description,
    };
  }
  return {
    title: "Dhora",
    description: "",
  };
}

export default async function BusinessProfile(props: propType) {
  const [myInfo, business] = await Promise.all([
    await me(),
    await getBusinessDetails(props.params.slug),
  ]);
  if (!business.success || !business.data) {
    return <div className="text-center">Unable to fetch business details</div>;
  }

  const groupedPackages = groupPackagesByGroupId(business.data.packages);

  const groupedAddOns = groupAddOnsByGroupId(business.data.add_ons);
  return (
    <>
      <div className="flex flex-col gap-5 pb-[44px] md:pb-[52px]">
        <Assets assets={business.data.assets} />
        <div className="grid grid-cols-10 gap-5">
          <div className="col-span-10 flex flex-col gap-5">
            <BusinessDetails business={business.data} />
            {groupedPackages.length > 0 ? (
              <div>
                <div className="text-secondary-light-gray font-semibold text-base">
                  Packages
                </div>
                <Preview
                  packagesGroups={business.data.package_groups}
                  groupedPackages={groupedPackages}
                  readOnly
                />
              </div>
            ) : null}
            {groupedAddOns.length > 0 ? (
              <div>
                <div className="text-secondary-light-gray font-semibold text-base">
                  Add Ons
                </div>
                <AddOnPreview
                  addOnGroups={business.data.add_on_groups}
                  groupedAddOns={groupedAddOns}
                  readOnly
                />
              </div>
            ) : null}
            <Reviews reviews={business.data.ratings ?? []} rating_summary={business.data.rating_summary}/>
          </div>
        </div>
      </div>
      <ScheduleCall
        user={myInfo.data}
        packages={business.data.packages}
        addOns={business.data.add_ons}
        bookingTypes={business.data.booking_types}
      />
    </>
  );
}
