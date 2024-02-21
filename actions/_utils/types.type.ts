import { SubmittedTemplateType } from "../(protected)/(contracts)/_utils/submittedContract.type";
import { getBusinessContract } from "../(protected)/(contracts)/getContracts";
import { getContractTemplate } from "../(protected)/(contracts)/initiateContract";
import { getUser } from "../(public)/(auth)/me";

type errorType = { success: false; error: string; data?: never };

export type profileType = Awaited<ReturnType<typeof getUser>>;

export type businessContractType = Awaited<
  ReturnType<typeof getBusinessContract>
>;

export type contractTemplateType = Awaited<
  ReturnType<typeof getContractTemplate>
>;

export type initiateContractResponseType =
  | {
      success: true;
      data: { error?: never; token: string; contract?: contractTemplateType };
    }
  | errorType;

export type submitContractResponseType =
  | {
      success: true;
      data: string;
    }
  | errorType;

export type getSubmittedContractResponseType =
  | {
      success: true;
      data: SubmittedTemplateType;
    }
  | errorType;
