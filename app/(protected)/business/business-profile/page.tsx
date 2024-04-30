import React from "react";
import { me } from "@/actions/(auth)/me";
import { getBusinessAssets } from "@/actions/(protected)/business/assets/getBusinessAssets";
import Assets from "./_components/assets";
import BusinessDetails from "./_components/business-details";
import Preview from "./_components/package/preview";
import { groupPackagesByGroupId, groupAddOnsByGroupId } from "@/lib/common";
import { getPackageGroups } from "@/actions/(protected)/business/packages/getPackageGroups";
import { getPackages } from "@/actions/(protected)/business/packages/getPackages";
import { getAddOnGroups } from "@/actions/(protected)/business/add-ons/getAddOnGroups";
import { getAddOns } from "@/actions/(protected)/business/add-ons/getAddOns";
import AddOnPreview from "./_components/add-ons/preview";
import ScheduleCall from "./_components/schedule-call";
import { getBookingTypes } from "@/actions/(protected)/business/booking-types/getBookingTypes";

export default async function BusinessProfile() {
  const [
    user,
    assets,
    packagesGroups,
    packages,
    addOnGroups,
    addOns,
    bookingTypes,
  ] = await Promise.all([
    await me(),
    await getBusinessAssets(),
    await getPackageGroups(),
    await getPackages(),
    await getAddOnGroups(),
    await getAddOns(),
    await getBookingTypes(),
  ]);

  const groupedPackages = groupPackagesByGroupId(packages.data);

  const groupedAddOns = groupAddOnsByGroupId(addOns.data);

  if (!user.success) {
    return <div className="text-center">Unable to fetch user details</div>;
  }

  return (
    <div className="flex flex-col gap-5">
      <Assets assets={assets} />

      <div className="grid grid-cols-10 gap-5">
        <div className="col-span-7 flex flex-col gap-5">
          <BusinessDetails user={user.data} />
          <div>
            <div className="text-secondary-light-gray font-semibold text-base">
              Packages
            </div>
            <Preview
              packagesGroups={packagesGroups.data}
              groupedPackages={groupedPackages}
              readOnly
            />
          </div>
          <div>
            <div className="text-secondary-light-gray font-semibold text-base">
              Add Ons
            </div>
            <AddOnPreview
              addOnGroups={addOnGroups.data}
              groupedAddOns={groupedAddOns}
              readOnly
            />
          </div>
        </div>
        <div className="col-span-3 sticky top-0 h-fit pt-4">
          <ScheduleCall
            user={user.data}
            packages={packages.data}
            addOns={addOns.data}
            bookingTypes={bookingTypes.data}
          />
        </div>
      </div>
    </div>
  );
}
