import { invoiceSchemaType } from "@/app/(protected)/business/invoices/_utils/schema";
import { format } from "date-fns";
import { PLATFORM_FEE } from "./constant";

export function getInitial(name: string) {
  const words = name.split(" ");
  const initials = words.map(word => word[0].toUpperCase());
  const result = initials.join("");

  return result;
}

export function formatDate(date: Date) {
  return format(new Date(date), "MMM dd,yyyy");
}

export function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function searchTableData<T extends {}>(
  rows: T[],
  filterString: string
): T[] {
  const filter = filterString.toLowerCase();

  const filteredArray = rows.filter(row => {
    return Object.values(row).some(propValue => {
      const stringValue = String(propValue).toLowerCase();
      return stringValue.includes(filter);
    });
  });

  return filteredArray;
}

export function stringCasting(value: number) {
  if (isNaN(value)) {
    return "";
  }
  return String(value);
}


export const generateBreakdownPrice = (
  items: invoiceSchemaType["items"],
  tax: number
) => {
  const subtotal = items.reduce((prev, curr) => {
    prev += (curr.price ?? 0) * (curr.quantity ?? 0);
    return prev;
  }, 0);

  let total = subtotal;

  let taxes = (subtotal / 100) * tax;
  let platformFee = (total / 100) * PLATFORM_FEE;
  return {
    subtotal,
    total: total + taxes + platformFee,
    tax: taxes,
    platformFee,
  };
};