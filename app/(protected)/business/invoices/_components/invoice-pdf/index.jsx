import { formatAmount, generateBreakdownPrice } from '@/lib/common'
import { PLATFORM_FEE } from '@/lib/constant'
import { useAuthStore } from '@/provider/store/authentication'
import { useToast } from "@/components/ui/use-toast";
import html2pdf from "html2pdf.js";
import { useEffect, useState } from 'react';
import { checkout } from '@/actions/(protected)/stripe/checkout';
import { useRouter } from 'next/navigation';

const title = {
  fontWeight: 600,
  color: "#1f2937",
  fontSize: "16px",
  wordBreak: "break-all",
}
const values = {
  fontWeight: 400,
  color: "#4b5563",
  fontSize: "14px",
  wordBreak: "break-all"
}

const invoiceDetail = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "16px",
  width: "fit-content"
}

const invoiceIdStyle = {
  color: "#1f2937",
  fontWeight: 500,
  fontSize: "16px",
}

const subtitle = {
  color: "#4b5563",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: 1,
  marginTop: "2px",
}

const customerDetail = {
  width: "200px",
  display: "flex",
  flexDirection: "column",
  width: "fit-content",
}

const tableHeader = {
  margin: 0,
  padding: "0px 6px 12px 6px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "fit-content",
  wordBreak: "break-all",
  fontWeight: 400,
  fontSize: "12px",
}


const tableItem = {
  margin: 0,
  padding: "0px 6px 12px 6px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "fit-content",
  wordBreak: "break-all",
  fontWeight: 400,
  fontSize: "12px",
}


const itemIndex = {
  flex: 0.3,
}

const itemName = {
  flex: 2,
  justifyContent: "flex-start"
}

const itemRests = {
  flex: 1
}


const notes = {
  display: "flex",
  flexDirection: "column",
  width: "300px"
}
const priceSummary = {
  width: "300px",
  borderRadius: "12px",
  border: "1px solid #707070",
  marginLeft: "auto"
}

const footerWrapper = {
  display: "flex",
  justifyContent: "spaceBetween",
  marginTop: "16px",
}

const spaceBetween = {
  display: "flex",
  justifyContent: "space-between"
}

const subtotal = {
  color: "#1f2937",
  fontWeight: 600,
  padding: "0px 6px 12px 6px",
  fontSize: "14px",
  borderBottom: "1px solid #707070",
}

const taxes = {
  color: "#1f2937",
  padding: "0px 6px 12px 6px",
  fontSize: "14px",
  borderBottom: "1px solid #707070",
}

const platformFees = {
  color: "#1f2937",
  padding: "0px 6px 12px 6px",
  fontSize: "14px",
  borderBottom: "1px solid #707070",
}

const total = {
  fontWeight: "700",
  color: "#111827",
  fontSize: "14px",
  padding: "0px 6px 12px 6px",

}




const InvoicePdf = (props) => {
  const navigate = useRouter()
  const { invoice, savePdf } = props
  const { invoiceId, trigger } = savePdf
  const { profile } = useAuthStore()
  const { business } = profile
  const { toast } = useToast();
  const [logoBase64, setLogoBase64] = useState("")

  const { name, address, contact, logo } = business

  const items = invoice.items

  const priceBreakdown = generateBreakdownPrice(
    items,
    invoice?.tax ?? 0,
    invoice?.platform_fee ?? PLATFORM_FEE
  );

  const getLogo = () => {
    if (logo) {
      fetch(logo).then(response => response.blob()).then((blob => {
        const reader = new FileReader();
        reader.onload = function () {
          const dataURL = reader.result;
          setLogoBase64(dataURL)
        };
        reader.readAsDataURL(blob);
      })).catch(err => {
        console.error("Error fetching Logo:", err);
      })
    }
  }

  useEffect(() => {
    getLogo()
  }, [logo])

  const handleCheckout = async (pdf) => {

    const imageForm = new FormData();
    imageForm.append("pdf", pdf);

    const res = await checkout({ invoiceId, file: imageForm });
    if (res.success) {
      toast({
        title: res.data,
      });
      navigate.replace("/business/invoices");
    } else {
      toast({
        title: res.error,
      });
    }
  }


  const save = () => {
    const element = document.getElementById('invoice-pdf');
    var opt = {
      margin: 0,
      filename: 'myfile.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };


    html2pdf().from(element).set(opt).output('blob').then(function (pdfBlob) {
      const file = new File([pdfBlob], 'invoice.pdf', { type: 'application/pdf' });
      handleCheckout(file)
    }).catch(function (error) {
      console.error("Error generating PDF:", error);
    });

  };


  useEffect(() => {
    if (trigger && invoiceId) {
      save()
    }
  }, [invoiceId, trigger])

  return (
    <div className="fixed bottom-[300vh] -z-10 w-[1200px] overflow-hidden opacity-0 ">
      <div id="invoice-pdf" style={{
        padding: "16px",
        borderRadius: "5px",
      }}>
        <div style={
          { display: "flex", justifyContent: "space-between", marginBottom: "24px" }
        }>
          <div style={{ width: "200px", display: "flex", flexDirection: "column" }} >
            <img
              src={logoBase64}
              style={{
                height: "72px",
                width: "72px",
                borderRadius: "5px",
                border: "1px solid #707070",
                marginBottom: "16px",
                backgroundColor: "#0b0d0f",
              }}
              alt={name}
            />

            <span style={title}>{name}</span>
            <span style={values}>{address}</span>
            <span style={values}>({contact})</span>
          </div>
          <div style={{ width: "200px" }}>
            <div style={{ width: "fit-content", marginLeft: "auto" }}>
              <div style={invoiceDetail}>
                <span style={invoiceIdStyle} >INV - #{invoiceId.substring(invoiceId.length - 5)}</span>
                <span style={subtitle} >Invoice Number</span>
              </div>
              <div style={customerDetail}>
                <span style={{ ...title, marginBottom: "5px" }}>Bill To</span>
                <span style={values}>{invoice?.customer_name}</span>
                <span style={values}>{invoice?.customer_address}</span>
                <span style={values}>({invoice?.customer_contact})</span>
              </div>
            </div>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead >
            <tr style={{
              backgroundColor: "#d1d5db",
              color: "#1f2937",
              borderRadius: "5px 5px 0px 0px",
              fontWeight: 400,
              border: "1px solid #707070",
              margin: "0px",
              display: "flex",
              padding: "0px",
            }}>
              <th style={{ ...tableHeader, ...itemIndex }}>#</th>
              <th style={{ ...tableHeader, ...itemName }}>Item</th>
              <th style={{ ...tableHeader, ...itemRests }}>Quantity</th>
              <th style={{ ...tableHeader, ...itemRests }}>Unit Price</th>
              <th style={{ ...tableHeader, ...itemRests }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map(
              (
                i,
                index
              ) => <tr key={i.id} style={{ color: "#111827", fontWeight: 400, margin: 0, display: "flex", border: "1px solid #707070", borderTop: "none", borderRadius: invoice.items.length === index + 1 ? "0px 0px 5px 5px" : "" }}>
                  <td style={{ ...tableItem, ...itemIndex }}>{index + 1}</td>
                  <td style={{ ...tableItem, ...itemName }}>{i.name}</td>
                  <td style={{ ...tableItem, ...itemRests }}>{i.quantity}</td>
                  <td style={{ ...tableItem, ...itemRests }}>{formatAmount(i.price)}</td>
                  <td style={{ ...tableItem, ...itemRests }}>{formatAmount(i.price * i.quantity)}</td>
                </tr>
            )}
          </tbody>
        </table >

        <div style={footerWrapper}>
          <div style={notes}>
            <span style={{ ...title, marginBottom: "5px" }} >Notes</span>
            <span style={values} >{invoice?.notes}</span>
          </div>
          <div style={priceSummary}>
            <div style={{ ...spaceBetween, ...subtotal }}>
              <span>Sub-Total</span>
              <span>{formatAmount(priceBreakdown.subtotal)}</span>
            </div>
            <div style={{ ...spaceBetween, ...taxes }}>
              <span>Taxes</span>
              <span>{formatAmount(priceBreakdown.tax)}</span>
            </div>
            <div style={{
              ...spaceBetween, ...platformFees
            }}>
              <span>Application Fees</span>
              <span>{formatAmount(priceBreakdown.platformFee)}</span>
            </div>
            <div style={{ ...spaceBetween, ...total }}>
              <span>Total</span>
              <span>{formatAmount(priceBreakdown.total)}</span>
            </div>
          </div>
        </div >
      </div >
    </div>
  )
}

export default InvoicePdf