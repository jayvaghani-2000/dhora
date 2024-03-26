import React from "react";
import { useTimezoneSelect, allTimezones } from "react-timezone-select";

const labelStyle = "original";
const timezones = {
  ...allTimezones,
};

export const useTimezone = () => {
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });

  return { options, parseTimezone };
};
