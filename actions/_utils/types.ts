import { getBusinessContract } from "../(protected)/(contracts)/getContracts";
import { getUser } from "../(public)/(auth)/me";

export type profileType = Awaited<ReturnType<typeof getUser>>;
export type businessContractType = Awaited<
  ReturnType<typeof getBusinessContract>
>;
