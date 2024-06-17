import { getInvoicesByEvent } from "@/actions/(protected)/business/invoices/getInvoiceByEvent";
import Invoices from "@/app/(protected)/business/invoices/_components/invoices";

type propType = { params: { slug: string } };

const EventInvoices = async (prop: propType) => {
  const data = await getInvoicesByEvent({ event_id: prop.params.slug });

  return data.success ? (
    <Invoices invoices={data.data} showAction={false} />
  ) : null;
};

export default EventInvoices;
