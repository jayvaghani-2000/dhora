import { getInvoices } from "@/actions/(protected)/business/invoices/getInvoices";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LiaPlusSolid } from "react-icons/lia";
import Invoices from "./_components/invoices";

export default async function InvoicesPage() {
  const result = await getInvoices();

  return (
    <div>
      <div className="text-right">
        <Link href="/business/invoices/generate" className="w-fit inline-block">
          <Button className="flex gap-1 items-center p-2 h-fit lg:px-2">
            <LiaPlusSolid size={14} className=" text-black" /> Create Invoice
          </Button>
        </Link>
      </div>

      {result.success ? <Invoices invoices={result.data} showAction={true}/> : null}
    </div>
  );
}
