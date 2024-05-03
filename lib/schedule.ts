import dayjs from "./dayjs";

export const getTimezoneDate = ({
  time,
  current,
  output,
  day,
}: {
  time: string;
  current: string;
  output: string;
  day: number;
}) => {
  let date = dayjs(time, "h:mm a").day(day);

  return date.tz(current).tz(output).day();
};

export const timeSlotsUtc = (
  INCREMENT: number,
  date: string,
  timezone: string
) => {
  const dayStart = dayjs.tz(date, timezone).startOf("day");
  const dayEnd = dayjs.tz(date, timezone).endOf("day");

  const nowLocal = dayjs().tz(timezone);

  const options = [];
  let currentTime = nowLocal.isAfter(dayStart)
    ? nowLocal
        .startOf("minute")
        .add(INCREMENT - (nowLocal.minute() % INCREMENT), "minutes")
    : dayStart;

  while (currentTime.isBefore(dayEnd)) {
    if (currentTime.isAfter(nowLocal)) {
      options.push(currentTime.utc().format());
    }
    currentTime = currentTime.add(INCREMENT, "minutes");
  }

  if (!options.includes(dayEnd.utc().format()) && dayEnd.isAfter(nowLocal)) {
    options.push(dayEnd.utc().format());
  }

  return options;
};

export const utcToHhMm = (time: string, timezone: string) => {
  return dayjs(time).utc().tz(timezone).format("h:mm A");
};
