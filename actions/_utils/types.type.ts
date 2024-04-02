import { getContracts } from "../(protected)/contracts/getContracts";
import { getSubmittedContracts } from "../(protected)/contracts/getSubmittedContract";
import { initiateContract } from "../(protected)/contracts/initiateContract";
import { submitContract } from "../(protected)/contracts/submitContract";
import { getUser } from "../(auth)/me";
import { getInvoices } from "../(protected)/invoices/getInvoices";
import { createAvailabilitySchema, createInvoiceSchema } from "@/db/schema";
import { z } from "zod";
import { getInvoiceDetail } from "../(protected)/invoices/getInvoiceDetail";
import { getInvoiceInfo } from "../(protected)/stripe/checkout";
import { getAvailabilityDetail } from "../(protected)/availability/getAvailabilityDetail";
import { getAvailability } from "../(protected)/availability/getAvailability";
import { getBookingTypes } from "../(protected)/booking-types/getBookingTypes";
import { getBookingTypeDetails } from "../(protected)/booking-types/getBookingTypeDetails";

export type errorType = { success: false; error: string; data?: never };

export type profileType = Awaited<ReturnType<typeof getUser>>;

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
