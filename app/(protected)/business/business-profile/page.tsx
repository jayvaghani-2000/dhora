import React from "react";
import { me } from "@/actions/(auth)/me";
import Assets from "./_components/assets";
import BusinessDetails from "./_components/business-details";
import Preview from "./_components/package/preview";
import { groupPackagesByGroupId, groupAddOnsByGroupId } from "@/lib/common";
import AddOnPreview from "./_components/add-ons/preview";
import ScheduleCall from "./_components/schedule-call";
import { getMyBusinessDetails } from "@/actions/(protected)/business/getMyBusinessDetail";

export default async function BusinessProfile() {
  const [meInfo, business] = await Promise.all([
    await me(),
    await getMyBusinessDetails(),
  ]);

  if (!business.success || !business.data) {
    return <div className="text-center">Unable to fetch business details</div>;
  }

  const groupedPackages = groupPackagesByGroupId(business.data.packages);

  const groupedAddOns = groupAddOnsByGroupId(business.data.add_ons);

  return (
    <>
      <div className="flex flex-col gap-5 pb-[44px] md:pb-[52px]">
        <Assets assets={business.data.assets} deletable />

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
          </div>
        </div>
      </div>
      <ScheduleCall
        user={meInfo.data}
        packages={business.data.packages}
        addOns={business.data.add_ons}
        bookingTypes={business.data.booking_types}
      />
    </>
  );
}
