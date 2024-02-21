import { initiateContract } from "@/actions/(protected)/(contracts)/initiateContract";
import ContractBuilder from "./_components/contractBuilder";
import { initiateContractResponseType } from "@/actions/_utils/types.type";

type propType = {
  readonly searchParams: {
    c_id?: string;
  };
};

export default async function NewContractsPage(props: propType) {
  const data: initiateContractResponseType = await initiateContract(
    props.searchParams.c_id
  );

  return (
    <div className="p-5 md:p-6">
      {data.success ? (
        <ContractBuilder
          token={data.data.token}
          contract={data.data.contract}
        />
      ) : null}
    </div>
  );
}
