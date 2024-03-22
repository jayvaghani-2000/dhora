"use client";
import React, { useState } from "react";
import TimeSlot from "./time-slot";
import { initializeAvailability } from "../_utils/initializeAvailability";
import TimezoneSelect from "@/components/shared/timezone-select";
import { timeZone } from "@/lib/common";
import { ITimezoneOption } from "react-timezone-select";
import AvailabilityHeader from "./availability-header";

const AvailabilityForm = () => {
  const data = initializeAvailability();
  const [availabilityTimeZone, setAvailabilityTimeZone] = useState(timeZone);

  const handleChangeTimezone = (value: ITimezoneOption) => {
    setAvailabilityTimeZone(value.value);
  };

  return (
    <div className="flex flex-col gap-5">
      <AvailabilityHeader />
      <div className="flex gap-5">
        <TimeSlot data={data} />
        <div className="min-w-[400px]">
          <div className="max-w-[300px] mr-auto">
            <TimezoneSelect
              value={availabilityTimeZone}
              onChange={handleChangeTimezone}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityForm;
