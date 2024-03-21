"use client";
import React from "react";
import TimeRange from "./time-slot/time-range";
import TimeSlot from "./time-slot";
import { initializeAvailability } from "../_utils/initializeAvailability";

const AvailabilityForm = () => {
  const data = initializeAvailability();

  return (
    <div>
      <TimeSlot data={data} />
    </div>
  );
};

export default AvailabilityForm;
