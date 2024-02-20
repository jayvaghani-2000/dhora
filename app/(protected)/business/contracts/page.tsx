import { getContracts } from "@/actions/(protected)/(contracts)/getContracts";
import Placeholder from "./_components/placeholder";
import Link from "next/link";
import { businessContractType } from "@/actions/_utils/types";

export default async function ContractsPage() {
  const data = await getContracts();

  return (
    <div className="p-5 md:p-6">
      <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] overflow-auto auto-rows-auto	">
        <Placeholder />
        {data.success
          ? data.data.map((i: businessContractType[0]) => (
              <Link
                href={`/business/contracts/new?c_id=${i.template_id}`}
                key={i.id}
                className=" bg-primary-black w-full h-[120px]  md:h-[140px] rounded-sm flex flex-col justify-center items-center"
              >
                <div className="text-white font-bold text-xs md:text-base">
                  {i.name}
                </div>
              </Link>
            ))
          : null}
      </div>
    </div>
  );
}
