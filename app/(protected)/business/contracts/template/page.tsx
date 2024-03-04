import { initiateContract } from "@/actions/(protected)/contracts/initiateContract";
import ContractBuilder from "./_components/contractBuilder";

type propType = {
  readonly searchParams: {
    c_id?: string;
  };
};

export default async function NewContractsPage(props: propType) {
  const data = await initiateContract(props.searchParams.c_id);

  return data.success ? <ContractBuilder data={data.data} /> : null;
}
