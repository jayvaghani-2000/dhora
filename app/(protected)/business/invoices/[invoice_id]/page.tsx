import { getInvoiceDetail } from "@/actions/(protected)/invoices/getInvoiceDetail";
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
    business_name: user?.data?.business?.name ?? "",
    business_address: user?.data?.business?.address ?? "",
    business_email: user?.data?.email ?? "",
    business_contact: user?.data?.business?.contact ?? "",
    ...result.data,
  };

  delete invoiceDetail.business;
  delete invoiceDetail.business_id;
  delete invoiceDetail.created_at;
  delete invoiceDetail.updated_at;

  return result.success ? (
    <InvoiceForm
      user={user.data}
      mode="EDIT"
      invoiceData={invoiceDetail as invoiceSchemaType}
    />
  ) : null;
}
