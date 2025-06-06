import { invoiceSchemaType } from "@/lib/schema";
import { format } from "date-fns";
import { PLATFORM_FEE } from "./constant";
import clsx from "clsx";
import { getTimeZones } from "@vvo/tzdb";
import { invoiceStatusTypeEnum } from "@/db/schema";
import { getAddOnsType, getPackagesType } from "@/actions/_utils/types.type";
import dayjs from "@/lib/dayjs";
import { isNull, isUndefined } from "lodash";

export const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function getInitial(name: string) {
  const words = name.split(" ");
  const initials = words.map(word => word[0]?.toUpperCase());
  const result = initials.join("");

  return result;
}

export function formatDate(date: Date) {
  return format(new Date(date), "MMM dd,yyyy");
}

export function formatDateWithTimeStamp(date: Date) {
  const localTime = dayjs(date).utc().tz(timeZone).format("MMM D,YYYY h:mm a");
  return localTime;
}

export function dateWithoutTime(date: Date | string) {
  return format(new Date(date), "yyyy-MM-dd");
}

export const getDateFromTime = (time: string) => {
  let date = dayjs(time, "h:mm a");
  const minutes = date.get("minutes");
  if (minutes === 59) {
    date = date.add(59, "seconds").add(999, "milliseconds");
  }

  return date.format("YYYY-MM-DDTHH:mm:ss[Z]");
};

export const getDateTimeFormatted = (date: Date | string, time: string) => {
  let dateTime = dayjs(`${date} ${time}`, "YYYY-MM-DD h:mm a");
  const minutes = dateTime.get("minutes");
  if (minutes === 59) {
    dateTime = dateTime.add(59, "seconds").add(999, "milliseconds");
  }

  return dateTime.format("YYYY-MM-DDTHH:mm:ss[Z]");
};

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
  if (isNaN(value) || isNull(value) || isUndefined(value)) {
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

export const parseTimezone = (timeZone: string) => {
  const timeZonesWithUtc = getTimeZones({ includeUtc: true });

  const timezone = timeZonesWithUtc.find(i => i.group.includes(timeZone));

  return timezone?.name;
};

export const trimRichEditor = (value: string) => {
  return (value ?? "").replace(/(<p><br><\/p>)+/g, "$1");
};

export function extractVideoMetadata(file: File) {
  return new Promise((resolve, reject) => {
    let mime = file.type;
    let rd = new FileReader();

    rd.onload = function (e) {
      let blob = new Blob([e.target!.result as string], {
        type: mime,
      });
      let url = (URL || webkitURL).createObjectURL(blob);
      let video = document.createElement("video");
      video.preload = "metadata";
      video.addEventListener("loadedmetadata", function () {
        const metadata = {
          height: video.videoHeight,
          width: video.videoWidth,
        };

        (URL || webkitURL).revokeObjectURL(url);
        resolve(metadata);
      });
      video.src = url;
    };
    let chunk = file.slice(0, 500000);
    rd.readAsArrayBuffer(chunk);
  });
}

export function groupPackagesByGroupId(packages: getPackagesType["data"]) {
  const groupedPackages = {} as {
    [key: string]: {
      package_group_id: string | null;
      package: getPackagesType["data"];
    };
  };
  const nonGroupedPackages: {
    package_group_id: string | null;
    package: getPackagesType["data"];
  }[] = [];

  packages?.forEach(pack => {
    const groupId = pack.package_group_id;

    if (groupId !== null) {
      if (!groupedPackages[groupId]) {
        groupedPackages[groupId] = {
          package_group_id: groupId,
          package: [],
        };
      }
      groupedPackages[groupId].package!.push(pack);
    } else {
      nonGroupedPackages.push({
        package_group_id: null,
        package: [pack],
      });
    }
  });

  return Object.values(groupedPackages).concat(nonGroupedPackages);
}

export function groupAddOnsByGroupId(addOns: getAddOnsType["data"]) {
  const groupedPackages = {} as {
    [key: string]: {
      add_on_group_id: string | null;
      addOn: getAddOnsType["data"];
    };
  };
  const nonGroupedPackages: {
    add_on_group_id: string | null;
    addOn: getAddOnsType["data"];
  }[] = [];

  addOns?.forEach(i => {
    const groupId = i.add_on_group_id;

    if (groupId !== null) {
      if (!groupedPackages[groupId]) {
        groupedPackages[groupId] = {
          add_on_group_id: groupId,
          addOn: [],
        };
      }
      groupedPackages[groupId].addOn!.push(i);
    } else {
      nonGroupedPackages.push({
        add_on_group_id: null,
        addOn: [i],
      });
    }
  });

  return Object.values(groupedPackages).concat(nonGroupedPackages);
}
