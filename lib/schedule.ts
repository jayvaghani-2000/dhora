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
  availability: Array<{ start_time: string; end_time: string }>,
  date: string,
  timezone: string
) => {
  const options: string[] = [];
  const nowUtc = dayjs.utc();
  const targetDate = dayjs.tz(date, timezone).startOf("day").format();

  availability.forEach(period => {
    let currentTime = dayjs.utc(period.start_time);
    const endTime = dayjs.utc(period.end_time);

    while (currentTime.isBefore(endTime)) {
      if (
        currentTime.isAfter(nowUtc) &&
        dayjs(currentTime).tz(timezone).isSame(targetDate, "day")
      ) {
        options.push(currentTime.format());
      }
      currentTime = currentTime.add(INCREMENT, "minutes");
    }

    if (
      !options.includes(endTime.format()) &&
      currentTime.isSame(endTime, "day")
    ) {
      options.push(endTime.format());
    }
  });

  return options;
};

export const utcToHhMm = (time: string, timezone: string) => {
  return dayjs(time).utc().tz(timezone).format("h:mm A");
};
