import { invoiceSchemaType } from "@/lib/schema";
import { format } from "date-fns";
import { PLATFORM_FEE } from "./constant";
import clsx from "clsx";
import { getTimeZones } from "@vvo/tzdb";
import { invoiceStatusTypeEnum } from "@/db/schema";

export function getInitial(name: string) {
  const words = name.split(" ");
  const initials = words.map(word => word[0]?.toUpperCase());
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

export const amountToFixed = (amount: number) => {
  const fixed = amount.toFixed(2);
  return Number(fixed);
};

export const generateBreakdownPrice = (
  items: invoiceSchemaType["items"],
  tax: number,
  fee = PLATFORM_FEE
) => {
  const subtotal = items.reduce((prev, curr) => {
    prev += (curr.price ?? 0) * (curr.quantity ?? 0);
    return prev;
  }, 0);

  let total = subtotal;

  let taxes = (total / 100) * tax;
  let platformFee = (total / 100) * fee;
  return {
    subtotal: amountToFixed(subtotal),
    total: amountToFixed(total + taxes + platformFee),
    tax: amountToFixed(taxes),
    platformFee: amountToFixed(platformFee),
  };
};

export const itemRateWithFeeAndTaxes = (
  item: invoiceSchemaType["items"][0],
  tax: number,
  fee: number
) => {
  let total = item.price;

  let taxes = (total / 100) * tax;
  let platformFee = (total / 100) * fee;
  return {
    total: amountToFixed(total + taxes + platformFee),
    tax: amountToFixed(taxes),
    platformFee: amountToFixed(platformFee),
  };
};

export const invoiceStatusColor = (
  status: (typeof invoiceStatusTypeEnum.enumValues)[number]
) =>
  clsx({
    "relative capitalize flex gap-1 items-center": true,
    "text-green-600 hover:text-green-600": status === "paid",
    "text-pink-700 hover:text-pink-700": status === "overdue",
    "text-yellow-600 hover:text-yellow-600": status === "pending",
    "text-gray-400 hover:text-gray-400": status === "draft",
  });

export const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const parseTimezone = (timeZone: string) => {
  const timeZonesWithUtc = getTimeZones({ includeUtc: true });

  return timeZonesWithUtc.find(i => i.group.includes(timeZone))?.name;
};
