import { getInvoices } from "@/actions/(protected)/invoices/getInvoices";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LiaPlusSolid } from "react-icons/lia";

export default async function InvoicesPage() {
  const result = await getInvoices();

  console.log("result ", result);

  return (
    <div>
      <Link href="/business/invoices/generate">
        <Button className="flex gap-1 items-center">
          <LiaPlusSolid size={14} className="text-black" /> Create Invoice
        </Button>
      </Link>
    </div>
  );
}
