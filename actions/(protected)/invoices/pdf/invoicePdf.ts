import {
  createInvoiceSchemaType,
  getInvoiceInfoType,
} from "@/actions/_utils/types.type";
import { formatAmount, generateBreakdownPrice } from "@/lib/common";

export const invoicePdf = async (invoice: getInvoiceInfoType) => {
  const items = invoice.items as createInvoiceSchemaType["items"];
  const businessDetail = invoice.business!;
  const priceBreakdown = generateBreakdownPrice(items, invoice?.tax ?? 0);

  const invoiceId = invoice.id.toString();

  const itemTable = `<table style="width:100%; border-collapse: collapse;">
          <thead >
            <tr style="
              background-color: #313238;
              color: #a29fab;
              border-radius: 5px 5px 0px 0px;
              font-weight: 400;
              border: 1px solid #707070;
              margin: 0px;
              display: flex;
            ">
              <th class="tableHeader itemIndex">#</th>
              <th class="tableHeader itemName">Item</th>
              <th class="tableHeader itemRests">Quantity</th>
              <th class="tableHeader itemRests">Unit Price</th>
              <th class="tableHeader itemRests">Total</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(
              (
                i,
                index
              ) => `<tr style="color: #fff; font-weight: 400; margin: 0; display: flex; border: 1px solid #707070; border-top: none; ${items.length === index + 1 ? "border-radius: 0px 0px 5px 5px;" : ""}">
              <td class="tableItem itemIndex">${index + 1}</td>
              <td class="tableItem itemName">${i.name}</td>
              <td class="tableItem itemRests">${i.quantity}</td>
              <td class="tableItem itemRests">${formatAmount(i.price)}</td>
              <td class="tableItem itemRests">${formatAmount(i.price * i.quantity)}</td>
            </tr>`
            )}
          </tbody>
        </table>`;

  return `<!DOCTYPE html>
      <html>
      <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
      rel="stylesheet"
    />
      <style>
      *,
      body {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Poppins", "Helvetica Neue", Helvetica, Arial, sans-serif;
      }

      .detailsWrapper {
        display: flex;
        justify-content: space-between;
        margin-bottom: 24px;
      }

      .businessDetail {
        width: 200px;
        display: flex;
        flex-direction: column;
      }

      .customerDetailWrapper {
        width: 200px;
      }
      .customerDetail {
        width: 200px;
        display: flex;
        flex-direction: column;
      }
      .logo {
        height: 72px;
        width: 72px;
        border-radius: 5px;
        border: 1px solid #707070;
        margin-bottom: 16px;
        background-color: #0b0d0f;
      }

      .tableHeader {
        margin: 0;
        padding: 8px 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: fit-content;
        word-break: break-all;
        font-weight: 400;
        font-size: 12px;
      }

      .tableItem {
        margin: 0;
        padding: 10px 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: fit-content;
        word-break: break-all;
        font-weight: 400;
        font-size: 12px;
      }

      .itemIndex {
        flex: 0.3;
      }

      .itemName {
        flex: 2;
        justify-content: flex-start;
      }

      .itemRests {
        flex: 1;
      }

      .title {
        font-weight: 600;
        color: #fff;
        font-size: 16px;
        word-break: break-all;
      }

      .values {
        font-weight: 400;
        color: #cecece;
        font-size: 14px;
        word-break: break-all;
      }

      .invoiceId {
        color: #fff;
        font-weight: 500;
        font-size: 16px;
      }
      
      .subtitle {
        color: #cecece;
        font-weight: 400;
        font-size: 12px;
        line-height: 1;
        margin-top: 2px;
      }

      .invoiceDetail {
        display: flex;
        flex-direction: column;
        margin-bottom: 16px;
      }

      .notes {
        display: flex;
        flex-direction: column;
        width: 300px;
      }
      .priceSummary {
        width: 300px;
        border-radius: 12px;
        border: 1px solid #707070;
      }

      .footerWrapper {
        display: flex;
        justify-content: space-between; 
        margin-top: 16px;
      }

      .space-between {
        display: flex;
        justify-content: space-between; 
      }

      .subtotal {
        color:#b8b8b8;
        font-weight: 600;
        padding: 6px 8px;
        font-size: 14px;
        border-bottom: 1px solid #707070;
      }
      
      .taxes, .platformFees {
        color:#b8b8b8;
        padding: 4px 8px;
        font-size: 14px;
        border-bottom: 1px solid #707070;
      }
      
      .total {
        font-weight: 700;
        color: #fff;
        font-size: 14px;
        padding: 6px 8px;

      }
      
      </style>
      </head>
      <body>
      <div style="
        margin: 20px;
        border: 1px solid #707070;
        padding: 16px;
        border-radius: 5px;
        background-color: #192229;
      ">
        <div class="detailsWrapper">
        <div class="businessDetail">
          <img
            src="https://cdn.dhora.app/stage/3306770255031829505/public/3321352976760570906.jpeg"
            class="logo"
            alt="${businessDetail.name}"
          />
          <span class="title">${businessDetail.name}</span>
          <span class="values">${businessDetail.address}</span>
          <span class="values">(${businessDetail.contact})</span>
        </div>
        <div class="customerDetailWrapper">
          <div class="invoiceDetail">
            <span class="invoiceId" >INV - #${invoiceId.substring(invoiceId.length - 5)}</span>
            <span class="subtitle" >Invoice Number</span>
          </div>
          <div class="customerDetail">
            <span class="title" style="margin-bottom: 5px;" >Bill To</span>
            <span class="values" >${invoice?.customer_name}</span>
            <span class="values" >${invoice?.customer_address}</span>
            <span class="values" >(${invoice?.customer_contact})</span>
          </div>
        </div>
      </div>
        ${itemTable}

        <div class="footerWrapper">
          <div class="notes">
            <span class="title" style="margin-bottom: 5px;" >Notes</span>
            <span class="values" >${invoice?.notes}</span>
          </div>
          <div class="priceSummary">
            <div class="space-between subtotal">
              <span>Sub-Total</span>
              <span>${formatAmount(priceBreakdown.subtotal)}</span>
            </div>
            <div class="space-between taxes">
              <span>Taxes</span>
             <span>${formatAmount(priceBreakdown.tax)}</span>
            </div>
            <div class="space-between platformFees">
              <span>Application Fees</span>
              <span>${formatAmount(priceBreakdown.platformFee)}</span>
            </div>
            <div class="space-between total">
              <span>Total</span>
              <span>${formatAmount(priceBreakdown.total)}</span>
            </div>
          </div>
        </div>
      </div>
      </body>
      </html>`;
};
