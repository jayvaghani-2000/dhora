import { initiateContract } from "@/actions/(protected)/(contracts)/initiateContract";
import ContractBuilder from "./_components/contractBuilder";

type propType = {
  searchParams: {
    c_id?: string;
  };
};

export default async function NewContractsPage(props: propType) {
  const data = await initiateContract(props.searchParams.c_id);

  return (
    <div className="p-5 md:p-6">
      <ContractBuilder token={data.data} />
    </div>
  );
}
