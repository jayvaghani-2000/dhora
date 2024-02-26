import { getContracts } from "@/actions/(protected)/(contracts)/getContracts";
import { getSubmittedContracts } from "@/actions/(protected)/(contracts)/getSubmittedContract";
import SubmittedContract from "./template/_components/submittedContract";
import Templates from "./_components/templates";

export default async function ContractsPage() {
  const data = await getContracts();
  const submittedContract = await getSubmittedContracts();

  return (
    <div className="flex flex-col gap-10">
      <Templates template={data} />

      {submittedContract.success ? (
        <SubmittedContract templates={submittedContract.data} />
      ) : null}
    </div>
  );
}
