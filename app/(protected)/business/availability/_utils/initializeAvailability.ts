import { createAvailabilitySchemaType } from "@/actions/_utils/types.type";
import { weekDays } from "@/lib/constant";
import { daysCode } from "@/lib/enum";
import { v4 as uuid } from "uuid";

export const formattedStartTime = (startTime: Date) =>
  startTime.getFullYear() +
  "-" +
  ("0" + (startTime.getMonth() + 1)).slice(-2) +
  "-" +
  ("0" + startTime.getDate()).slice(-2) +
  "T" +
  ("0" + startTime.getHours()).slice(-2) +
  ":" +
  ("0" + startTime.getMinutes()).slice(-2) +
  ":" +
  ("0" + startTime.getSeconds()).slice(-2) +
  "." +
  ("00" + startTime.getMilliseconds()).slice(-3) +
  "Z";

export const generateStartTime = (hour: number, min: number) => {
  const startTime = new Date();
  startTime.setHours(hour, min, 0, 0);

  return formattedStartTime(startTime);
};

export const generateEndTime = (hour: number, min: number) => {
  const endTime = new Date();
  endTime.setHours(hour, min, 0, 0);

  return formattedStartTime(endTime);
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
