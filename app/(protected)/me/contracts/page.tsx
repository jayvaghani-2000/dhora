import ReceivedContract from "./_components/receivedContractContract";
import { getReceivedContracts } from "@/actions/(protected)/@me/contracts/getReceivedContract";

export default async function ContractsPage() {
  const receivedContract = await getReceivedContracts();

  return (
    <div className="flex flex-col gap-10">
      {receivedContract.success ? (
        <ReceivedContract templates={receivedContract.data} />
      ) : null}
    </div>
  );
}
