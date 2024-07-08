import { initiateContract } from "@/actions/(protected)/business/contracts/initiateContract";
import ContractBuilder from "./_components/contractBuilder";
import { getEmailAndEvent } from "@/actions/(protected)/business/contracts/getEmailAndEvent";

type propType = {
  readonly searchParams: {
    c_id?: string;
  };
};

export default async function NewContractsPage(props: propType) {
  const data = await initiateContract(props.searchParams.c_id);
  const bookings = await getEmailAndEvent();

  return data.success ? (
    <ContractBuilder data={data.data} bookings={bookings.data!} />
  ) : null;
}
