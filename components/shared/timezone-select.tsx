import React from "react";
import CustomSelect from "./custom-select";
import { getTimeZones } from "@vvo/tzdb";
import { parseTimezone } from "@/lib/common";

type propType = {
  value: string;
  onChange: (value: string) => void;
};

const TimezoneSelect = (prop: propType) => {
  const { value, onChange } = prop;

  const timeZonesWithUtc = getTimeZones({ includeUtc: true });

  const options = timeZonesWithUtc.map(i => ({
    label: `${i.name.replace(/_/g, " ")} (${i.rawFormat.split(" ")[0]}) ${i.mainCities[0]}${i.mainCities[1] ? `, ${i.mainCities[1]}` : ""}`,
    value: i.name,
  }));

  return (
    <CustomSelect
      onChange={value => onChange(value)}
      placeholder="Select timezone"
      options={options}
      value={parseTimezone(value)}
      contentClassName="min-w-[300px]"
    />
  );
};

export default TimezoneSelect;
