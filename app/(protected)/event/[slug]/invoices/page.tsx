import { getInvoicesByEvent } from "@/actions/(protected)/business/invoices/getInvoiceByEvent";

type propType = { params: { slug: string }; };

const Invoices = async (prop: propType) => {

  const data = await getInvoicesByEvent({ event_id: prop.params.slug })
  return <div>Invoices</div>;
};

export default Invoices;
