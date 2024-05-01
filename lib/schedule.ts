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
