import { getContracts } from "../(protected)/business/contracts/getContracts";
import { getSubmittedContracts } from "../(protected)/business/contracts/getSubmittedContract";
import { initiateContract } from "../(protected)/business/contracts/initiateContract";
import { submitContract } from "../(protected)/business/contracts/submitContract";
import { getUser, me } from "../(auth)/me";
import { getInvoices } from "../(protected)/business/invoices/getInvoices";
import { createAvailabilitySchema, createInvoiceSchema } from "@/db/schema";
import { z } from "zod";
import { getInvoiceDetail } from "../(protected)/business/invoices/getInvoiceDetail";
import { getInvoiceInfo } from "../(protected)/business/stripe/checkout";
import { getAvailabilityDetail } from "../(protected)/business/availability/getAvailabilityDetail";
import { getAvailability } from "../(protected)/business/availability/getAvailability";
import { getBookingTypes } from "../(protected)/business/booking-types/getBookingTypes";
import { getBookingTypeDetails } from "../(protected)/business/booking-types/getBookingTypeDetails";
import {
  getAssets,
  getBusinessAssets,
} from "../(protected)/business/assets/getBusinessAssets";
import { uploadBusinessAssets } from "../(protected)/business/assets/uploadBusinessAssets";
import { getPackageGroups } from "../(protected)/business/packages/getPackageGroups";
import { getPackages } from "../(protected)/business/packages/getPackages";
import { getPackageDetails } from "../(protected)/business/packages/getPackageDetail";
import { getPackageAssets } from "../(protected)/business/assets/packages/getPackageAssets";
import { getEventDetails } from "../(protected)/customer/events/getEventDetails";
import { getSubEvents } from "../(protected)/customer/sub-events/getSubEvents";
import { getAddOnGroups } from "../(protected)/business/add-ons/getAddOnGroups";
import { getAddOns } from "../(protected)/business/add-ons/getAddOns";
import { getAddOnDetails } from "../(protected)/business/add-ons/getAddOnDetails";
import { getBusinesses } from "../(protected)/customer/businesses/getBusinesses";
import { getBookings } from "../(protected)/customer/booking/getBookings";
import { getBusinessDetails } from "../(protected)/business/getBusinessDetails";
import { getSubmittedContractsEvent } from "../(protected)/business/contracts/getSubmittedContractEvent";
import { getEmailAndEvent } from "../(protected)/business/contracts/getEmailAndEvent";
import { getBookingCustomer } from "../(protected)/customer/booking/getBookingCustomer";
import { getReviews } from "../(protected)/business/reviews/getReviews";

export type errorType = { success: false; error: string; data?: never };

export type profileType = Awaited<ReturnType<typeof getUser>>;
export type assetsType = NonNullable<Awaited<ReturnType<typeof getAssets>>>;

export type getProfileType = Awaited<ReturnType<typeof me>>;

export type getContractType = Awaited<ReturnType<typeof getContracts>>;

export type initiateContractResponseType = Awaited<
  ReturnType<typeof initiateContract>
>;

export type submitContractResponseType = Awaited<
  ReturnType<typeof submitContract>
>;

export type getSubmittedContractResponseType = Awaited<
  ReturnType<typeof getSubmittedContracts>
>;

export type getSubmittedContractEventResponseType = Awaited<
  ReturnType<typeof getSubmittedContractsEvent>
>;

export type getReviewType = Awaited<ReturnType<typeof getReviews>>;

export type getInvoicesResponseType = Awaited<ReturnType<typeof getInvoices>>;
export type getInvoicesDetailResponseType = Awaited<
  ReturnType<typeof getInvoiceDetail>
>;

export type createInvoiceSchemaType = z.infer<typeof createInvoiceSchema>;
export type createAvailabilitySchemaType = z.infer<
  typeof createAvailabilitySchema
>;
export type getInvoiceInfoType = NonNullable<
  Awaited<ReturnType<typeof getInvoiceInfo>>
>;
export type getAvailabilityDetailType = NonNullable<
  Awaited<ReturnType<typeof getAvailabilityDetail>>
>;
export type getAvailabilityType = NonNullable<
  Awaited<ReturnType<typeof getAvailability>>
>;
export type getBookingTypesType = NonNullable<
  Awaited<ReturnType<typeof getBookingTypes>>
>;
export type getBookingTypeDetailType = NonNullable<
  Awaited<ReturnType<typeof getBookingTypeDetails>>
>;
export type getBusinessAssetsType = NonNullable<
  Awaited<ReturnType<typeof getBusinessAssets>>
>;
export type uploadBusinessAssetsType = NonNullable<
  Awaited<ReturnType<typeof uploadBusinessAssets>>
>;
export type getPackageGroupsType = NonNullable<
  Awaited<ReturnType<typeof getPackageGroups>>
>;
export type getPackagesType = NonNullable<
  Awaited<ReturnType<typeof getPackages>>
>;
export type getPackageDetailsType = NonNullable<
  Awaited<ReturnType<typeof getPackageDetails>>
>;
export type getPackageAssetsType = NonNullable<
  Awaited<ReturnType<typeof getPackageAssets>>
>;

export type getEventDetailsType = NonNullable<
  Awaited<ReturnType<typeof getEventDetails>>
>;
export type getSubEventsType = NonNullable<
  Awaited<ReturnType<typeof getSubEvents>>
>;

export type getAddOnGroupsType = NonNullable<
  Awaited<ReturnType<typeof getAddOnGroups>>
>;
export type getAddOnsType = NonNullable<Awaited<ReturnType<typeof getAddOns>>>;

export type getAddOnsDetailsType = NonNullable<
  Awaited<ReturnType<typeof getAddOnDetails>>
>;

export type getBusinessesType = NonNullable<
  Awaited<ReturnType<typeof getBusinesses>>
>;
export type getBookingsType = NonNullable<
  Awaited<ReturnType<typeof getBookings>>
>;

export type getBusinessDetailsType = NonNullable<
  Awaited<ReturnType<typeof getBusinessDetails>>
>;

export type getEmailAndEventType = NonNullable<
  Awaited<ReturnType<typeof getEmailAndEvent>>
>;

export type getUserDetailsType = NonNullable<
  Awaited<ReturnType<typeof getBookingCustomer>>
>;
export enum businessTypes {
  "Event Planner",
  "Venue",
  "Photo & Video",
  "Entertainment",
  "Caterer",
  "Apparel",
  "Health & Beauty",
  "Other",
}

export enum invoiceStatusTypes {
  "paid",
  "pending",
  "draft",
  "overdue",
}
export enum packageSingleUnitTypes {
  "days" = "day",
  "hours" = "hour",
  "peoples" = "person",
}
export enum businessFilter {
  "a-z" = "a-z",
  "z-a" = "z-a",
  "rating" = "rating",
}
