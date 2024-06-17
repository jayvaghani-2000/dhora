import { getInvoiceDetail } from "@/actions/(protected)/business/invoices/getInvoiceDetail";
import InvoiceForm from "../_components/invoice-form";
import { me } from "@/actions/(auth)/me";
import { invoiceSchemaType } from "@/lib/schema";

type propType = {
  params: {
    invoice_id: string;
  };
};

export default async function InvoicesPage(props: propType) {
  const result = await getInvoiceDetail({
    id: props.params.invoice_id,
    mode: "edit",
  });
  const user = await me();

  const invoiceDetail = {
    name: user?.data?.business?.name ?? "",
    address: user?.data?.business?.address ?? "",
    email: user?.data?.email ?? "",
    contact: user?.data?.business?.contact ?? "",
    ...result.data,
  };

  delete invoiceDetail.business;
  delete invoiceDetail.business_id;
  delete invoiceDetail.created_at;
  delete invoiceDetail.updated_at;

  if (!user.success) {
    return <div className="text-center">Unable to fetch user details</div>;
  }

  return result.success ? (
    <InvoiceForm
      user={user.data}
      mode="EDIT"
      invoiceData={invoiceDetail as invoiceSchemaType}
    />
  ) : null;
}
