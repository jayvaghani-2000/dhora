import { invoiceSchemaType } from "@/app/(protected)/business/invoices/_utils/schema";
import { format } from "date-fns";
import { PLATFORM_FEE } from "./constant";
import clsx from "clsx";
import { invoiceStatusTypes } from "@/actions/_utils/types.type";
import { ITimezoneOption } from "react-timezone-select";
import dayjs from "./dayjs";

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

export const invoiceStatusColor = (status: invoiceStatusTypes) =>
  clsx({
    "relative capitalize flex gap-1 items-center": true,
    "text-green-600 hover:text-green-600": status === "paid",
    "text-pink-700 hover:text-pink-700": status === "overdue",
    "text-yellow-600 hover:text-yellow-600": status === "pending",
    "text-gray-400 hover:text-gray-400": status === "draft",
  });

export const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const timezoneFormatOffset = (offset: string) =>
  offset.replace(
    /^([-+])(0)(\d):00$/,
    (_, sign, _zero, hour) => `${sign}${hour}:00`
  );

export const handleTimezoneOptionLabel = (option: ITimezoneOption) => {
  const cityName = option.label.split(") ")[1];

  const timezoneValue = ` (${timezoneFormatOffset(dayjs.tz(undefined, option.value).format("Z"))}) ${cityName}`;

  return `${option.value.replace(/_/g, " ")}${timezoneValue}`;
};
