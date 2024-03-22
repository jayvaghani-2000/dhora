import React from "react";
import {
  useTimezoneSelect,
  allTimezones,
  ITimezoneOption,
} from "react-timezone-select";
import CustomSelect from "./custom-select";
import { handleTimezoneOptionLabel } from "@/lib/common";

const labelStyle = "original";
const timezones = {
  ...allTimezones,
};

type propType = {
  value: string;
  onChange: (value: ITimezoneOption) => void;
};

const TimezoneSelect = (prop: propType) => {
  const { value, onChange } = prop;
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });

  return (
    <CustomSelect
      onChange={value => onChange(parseTimezone(value))}
      placeholder="Select timezone"
      options={options.map(i => ({
        label: handleTimezoneOptionLabel(i),
        value: i.value.toString(),
      }))}
      value={parseTimezone(value).value}
    />
  );
};

export default TimezoneSelect;
