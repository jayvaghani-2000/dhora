import { useCallback, useMemo, useState } from "react";
import dayjs, { ConfigType } from "../dayjs";

export interface IOption {
  readonly label: string;
  readonly value: number;
}

const INCREMENT = 15;

export const useOptions = (timeFormat: number | null) => {
  const [filteredOptions, setFilteredOptions] = useState<IOption[]>([]);

  const options = useMemo(() => {
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
  }, [timeFormat]);

  const filter = useCallback(
    ({
      offset,
      limit,
      current,
    }: {
      offset?: ConfigType;
      limit?: ConfigType;
      current?: ConfigType;
    }) => {
      if (current) {
        const currentOption = options.find(
          option => option.value === dayjs(current).toDate().valueOf()
        );
        if (currentOption) setFilteredOptions([currentOption]);
      } else
        setFilteredOptions(
          options.filter(option => {
            const time = dayjs(option.value);
            return (
              (!limit || time.isBefore(limit)) &&
              (!offset || time.isAfter(offset))
            );
          })
        );
    },
    [options]
  );

  return { options: filteredOptions, filter };
};
