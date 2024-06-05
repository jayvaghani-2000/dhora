import { getContracts } from "@/actions/(protected)/business/contracts/getContracts";
import { getSubmittedContracts } from "@/actions/(protected)/business/contracts/getSubmittedContract";
import SubmittedContract from "./template/_components/submittedContract";
import Templates from "./_components/templates";

export default async function ContractsPage() {
  const data = await getContracts();
  const submittedContract = await getSubmittedContracts();

  return (
    <div className="flex flex-col gap-10">
      <Templates template={data} />

      {submittedContract.success ? (
        <SubmittedContract templates={submittedContract.data} showAction={true}/>
      ) : null}
    </div>
  );
}
