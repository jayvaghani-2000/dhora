import { createAvailabilitySchemaType } from "@/actions/_utils/types.type";
import { weekDays } from "@/lib/constant";
import { daysCode } from "@/lib/enum";
import { v4 as uuid } from "uuid";
import dayjs, { ConfigType } from "@/lib/dayjs";
import { timeZone } from "@/lib/common";

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
