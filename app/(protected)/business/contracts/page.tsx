import { getContracts } from "@/actions/(protected)/(contracts)/getContracts";
import Placeholder from "./_components/placeholder";
import Link from "next/link";
import {
  businessContractType,
  getSubmittedContractResponseType,
} from "@/actions/_utils/types.type";
import { getSubmittedContracts } from "@/actions/(protected)/(contracts)/getSubmittedContract";
import SubmittedContract from "./template/_components/submittedContract";

export default async function ContractsPage() {
  const data = await getContracts();
  const submittedContract: getSubmittedContractResponseType =
    await getSubmittedContracts();

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] overflow-auto auto-rows-auto	">
        <Placeholder />
        {data.success
          ? data.data.map((i: businessContractType[0]) => (
              <Link
                href={`/business/contracts/template?c_id=${i.template_id}`}
                key={i.id}
                className="px-2 bg-primary-black w-full h-[120px]  md:h-[140px] rounded-sm flex flex-col justify-center items-center border border-[#707070]"
              >
                <div className="text-white font-bold text-xs md:text-base text-center line-clamp-3	">
                  {i.name}
                </div>
              </Link>
            ))
          : null}
      </div>

      {submittedContract.success ? (
        <SubmittedContract templates={submittedContract.data} />
      ) : null}
    </div>
  );
}
