import {
  createAvailabilitySchemaType,
  getAvailabilityDetailType,
  getAvailabilityType,
} from "@/actions/_utils/types.type";
import { weekDays } from "@/lib/constant";
import { daysCode } from "@/lib/enum";
import { v4 as uuid } from "uuid";
import dayjs, { ConfigType } from "@/lib/dayjs";
import { parseTimezone, timeZone } from "@/lib/common";
import { nameOfDay } from "@/lib/weekday";
import { createAvailabilitySchema } from "@/db/schema";
import { z } from "zod";

export const localTime = (value: string | Date | number) => {
  return dayjs(new Date(value), {
    locale: timeZone,
  })
    .utc()
    .format();
};

export const localTimeValue = (value: ConfigType) => {
  const date = dayjs(value);
  const seconds = date.get("seconds");

  if (seconds === 59) {
    return date.utc().add(999, "milliseconds").toDate().valueOf();
  } else {
    return date.utc().toDate().valueOf();
  }
};

export const generateStartTime = (hour: number, min: number) => {
  let startTime = dayjs().utc().startOf("day");

  startTime = startTime.add(hour, "hours");
  startTime = startTime.add(min, "minutes");

  return localTime(startTime.toDate().valueOf());
};

export const generateEndTime = (hour: number, min: number) => {
  let endTime = dayjs().utc().startOf("day");
  endTime = endTime.add(hour, "hours");
  endTime = endTime.add(min, "minutes");

  return localTime(endTime.toDate().valueOf());
};

export const initializeAvailability = () => {
  const days = [
    daysCode.monday,
    daysCode.tuesday,
    daysCode.wednesday,
    daysCode.thursday,
    daysCode.friday,
  ];

  const timeSlots: (createAvailabilitySchemaType["availability"][0][0] & {
    id: string;
  })[][] = weekDays.map(i =>
    days.includes(daysCode[i])
      ? [
          {
            start_time: generateStartTime(9, 0),
            end_time: generateEndTime(17, 0),
            id: uuid(),
          },
        ]
      : []
  );
  return { days, timeSlots };
};

export const getDateSlotRange = (
  endField?: ConfigType,
  startField?: ConfigType
) => {
  const timezoneStartRange = dayjs(localTimeValue(startField)).utc();
  const nextRangeStart = dayjs(localTimeValue(endField)).utc();
  const nextRangeEnd =
    nextRangeStart.hour() === 23
      ? dayjs(nextRangeStart)
          .add(59, "minutes")
          .add(59, "seconds")
          .add(999, "milliseconds")
      : dayjs(nextRangeStart).add(1, "hour");

  const endOfDay = nextRangeStart.endOf("day");

  if (!nextRangeStart.isSame(endOfDay)) {
    return {
      append: {
        start: nextRangeStart.toDate(),
        end: nextRangeEnd.isAfter(endOfDay)
          ? endOfDay.toDate()
          : nextRangeEnd.toDate(),
      },
    };
  }

  const previousRangeStart = dayjs(startField).subtract(1, "hour");
  const startOfDay = timezoneStartRange.startOf("day");

  if (!timezoneStartRange.isSame(startOfDay)) {
    return {
      prepend: {
        start: previousRangeStart.isBefore(startOfDay)
          ? startOfDay.toDate()
          : previousRangeStart.toDate(),
        end: timezoneStartRange.toDate(),
      },
    };
  }
};

export const getTimeFromDate = (date: string) => {
  return dayjs(date).utc().format("h:mm a");
};

export const getDateFromTime = (time: string) => {
  let date = dayjs(time, "h:mm a");
  const minutes = date.get("minutes");
  if (minutes === 59) {
    date = date.add(59, "seconds").add(999, "milliseconds");
  }

  return date.format("YYYY-MM-DDTHH:mm:ss[Z]");
};

export const getTimeSlotsFromDate = (
  timeSlot: ReturnType<typeof initializeAvailability>["timeSlots"]
) => {
  return timeSlot.map(i =>
    i.map(j => ({
      start_time: getTimeFromDate(j.start_time),
      end_time: getTimeFromDate(j.end_time),
    }))
  );
};
export const getTimeSlotsFromTime = (
  timeSlot: createAvailabilitySchemaType["availability"]
) => {
  return timeSlot.map(i =>
    i.map(j => ({
      start_time: getDateFromTime(j.start_time),
      end_time: getDateFromTime(j.end_time),
      id: uuid(),
    }))
  );
};

type availabilitySummary = {
  [key: string]: number[];
};

export function availabilityAsString(
  availability:
    | NonNullable<getAvailabilityType["data"]>[0]
    | NonNullable<getAvailabilityDetailType["data"]>,
  { locale, hour12 }: { locale?: string; hour12?: boolean }
) {
  const setAvailability =
    availability.availability as createAvailabilitySchemaType["availability"];

  const resultArray = setAvailability.reduce((prev, dayAvailability, index) => {
    dayAvailability.reduce((innerPrev, availability) => {
      const key = `${availability.start_time} - ${availability.end_time}`;

      if (key in innerPrev) {
        innerPrev[key] = [...innerPrev[key], index];
      } else {
        innerPrev[key] = [index];
      }
      return innerPrev;
    }, prev as availabilitySummary);
    return prev;
  }, {} as availabilitySummary);

  const weekSpan = (matchDays: number[]) => {
    const days = matchDays
      .sort()
      .slice(1)
      .reduce(
        (days, day) => {
          if (
            days[days.length - 1].length === 1 &&
            days[days.length - 1][0] === day - 1
          ) {
            // append if the range is not complete (but the next day needs adding)
            days[days.length - 1].push(day);
          } else if (
            days[days.length - 1][days[days.length - 1].length - 1] ===
            day - 1
          ) {
            // range complete, overwrite if the last day directly preceeds the current day
            days[days.length - 1] = [days[days.length - 1][0], day];
          } else {
            // new range
            days.push([day]);
          }
          return days;
        },
        [[matchDays[0]]] as number[][]
      );
    return days
      .map(dayRange =>
        dayRange.map(day => nameOfDay(locale, day, "short")).join(" - ")
      )
      .join(", ");
  };

  return Object.keys(resultArray).map(
    i => `${weekSpan(resultArray[i])}, ${i.toUpperCase()}`
  );
}

export const getAvailabilityData = () => {
  const data = initializeAvailability();
  const userTimeZone = parseTimezone(timeZone);

  return {
    availability: getTimeSlotsFromDate(data.timeSlots),
    days: data.days,
    timezone: userTimeZone,
    default: true,
    name: "Default Availability",
  } as z.infer<typeof createAvailabilitySchema>;
};
