import { invoiceSchemaType } from "@/app/(protected)/business/invoices/_utils/schema";
import { format } from "date-fns";
import { PLATFORM_FEE } from "./constant";
import clsx from "clsx";

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

export const invoiceStatusClass = (status: string) =>
  clsx({
    "relative capitalize flex gap-1 items-center before:content-['']  before:h-2 before:w-2 before:rounded-full":
      true,
    "text-green-600 hover:text-green-600 before:bg-green-600":
      status === "paid",
    "text-pink-700 hover:text-pink-700 before:bg-pink-700":
      status === "overdue",
    "text-yellow-600 hover:text-yellow-600 before:bg-yellow-600":
      status === "pending",
    "text-gray-400 hover:text-gray-400 before:bg-gray-400": status === "draft",
  });

export const invoiceStatusColor = (status: string) =>
  clsx({
    "relative capitalize flex gap-1 items-center": true,
    "text-green-600 hover:text-green-600": status === "paid",
    "text-pink-700 hover:text-pink-700": status === "overdue",
    "text-yellow-600 hover:text-yellow-600": status === "pending",
    "text-gray-400 hover:text-gray-400": status === "draft",
  });
