import React from "react";
import { getTimeZones } from "@vvo/tzdb";
import { parseTimezone } from "@/lib/common";
import { SearchableSelect } from "@/components/shared/searchable-select";

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
    <SearchableSelect
      options={options}
      onChange={value => {
        onChange(value);
      }}
      placeholder="timezone"
      value={parseTimezone(value)}
    />
  );
};

export default TimezoneSelect;
