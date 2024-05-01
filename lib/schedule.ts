import dayjs from "./dayjs";

interface IOption {
  readonly label: string;
  readonly value: number;
}

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

const timeSlots = (timeFormat: number | null, INCREMENT: number) => {
  const end = dayjs().utc().endOf("day");

  const options: IOption[] = [];
  for (
    let t = dayjs().utc().startOf("day");
    t.isBefore(end);
    t = t.add(
      INCREMENT + (!t.add(INCREMENT).isSame(t, "day") ? -1 : 0),
      "minutes"
    )
  ) {
    options.push({
      value: t.toDate().valueOf(),
      label: dayjs(t)
        .utc()
        .format(timeFormat === 12 ? "h:mm a" : "HH:mm"),
    });
  }
  // allow 23:59
  options.push({
    value: end.toDate().valueOf(),
    label: dayjs(end)
      .utc()
      .format(timeFormat === 12 ? "h:mm a" : "HH:mm"),
  });

  return options;
};
