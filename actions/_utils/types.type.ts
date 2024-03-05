import { getContracts } from "../(protected)/contracts/getContracts";
import { getSubmittedContracts } from "../(protected)/contracts/getSubmittedContract";
import { initiateContract } from "../(protected)/contracts/initiateContract";
import { submitContract } from "../(protected)/contracts/submitContract";
import { getUser } from "../(auth)/me";
import { getInvoices } from "../(protected)/invoices/getInvoices";

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
