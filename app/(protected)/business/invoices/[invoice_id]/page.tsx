import { getInvoiceDetail } from "@/actions/(protected)/invoices/getInvoiceDetail";
import InvoiceForm from "../_components/invoice-form";
import { me } from "@/actions/(auth)/me";
import { invoiceSchemaType } from "../_utils/schema";

type propType = {
  params: {
    invoice_id: string;
  };
};

export default async function InvoicesPage(props: propType) {
  const result = await getInvoiceDetail(props.params.invoice_id);
  const user = await me();

  return (
    <InvoiceForm
      user={user.data}
      mode="EDIT"
      invoiceData={
        {
          business_name: user?.data?.business?.name ?? "",
          business_address: user?.data?.business?.address ?? "",
          business_email: user?.data?.email ?? "",
          business_contact: user?.data?.business?.contact ?? "",
          ...result.data,
        } as invoiceSchemaType
      }
    />
  );
}
