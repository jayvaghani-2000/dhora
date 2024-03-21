import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { weekDays } from "@/lib/constant";
import { daysCode } from "@/lib/enum";
import React, { useState } from "react";
import {
  formattedStartTime,
  generateEndTime,
  generateStartTime,
  initializeAvailability,
} from "../../_utils/initializeAvailability";
import TimeRange from "./time-range";
import { v4 as uuid } from "uuid";

type propType = {
  data: ReturnType<typeof initializeAvailability>;
};

const TimeSlot = (props: propType) => {
  const { data } = props;

  const { days: activeDays, timeSlots: selectedSlots } = data;

  const [days, setDays] = useState(activeDays);
  const [timeSlots, setTimeSlots] = useState(selectedSlots);

  const activateDayToggle = (checked: boolean, dayCode: number) => {
    if (checked) {
      setDays(prev => {
        const updatedDays = [...prev, dayCode];
        return updatedDays.sort();
      });

      setTimeSlots(prev => {
        const updatedSlot = { ...prev };
        updatedSlot[dayCode] = [
          {
            end_time: generateEndTime(17, 0),
            start_time: generateStartTime(9, 0),
            id: uuid(),
          },
        ];
        return updatedSlot;
      });
    } else {
      setDays(prev => {
        const updatedDays = prev.filter(i => i !== dayCode);
        return updatedDays.sort();
      });

      setTimeSlots(prev => {
        const updatedSlot = { ...prev };
        updatedSlot[dayCode] = [];
        return updatedSlot;
      });
    }
  };

  const handleUpdateStartTimeSlot = (
    value: number,
    dayCode: number,
    slotIndex: number
  ) => {
    setTimeSlots(prev => {
      const updatedSlot = { ...prev };
      updatedSlot[dayCode][slotIndex].start_time = value as unknown as string;
      return updatedSlot;
    });
  };

  const handleUpdateEndTimeSlot = (
    value: number,
    dayCode: number,
    slotIndex: number
  ) => {
    setTimeSlots(prev => {
      const updatedSlot = { ...prev };
      updatedSlot[dayCode][slotIndex].end_time = value as unknown as string;
      return updatedSlot;
    });
  };

  console.log("timeSlots", timeSlots);

  return (
    <div className="p-4 border border-divider rounded-lg flex gap-5 flex-col">
      {weekDays.map((i: keyof typeof daysCode) => {
        const isActiveDay = days.includes(daysCode[i]);
        return (
          <div key={i} className="flex">
            <div className="w-[140px]  flex items-center space-x-2">
              <Switch
                id={i}
                checked={isActiveDay}
                onCheckedChange={checked => {
                  activateDayToggle(checked, daysCode[i]);
                }}
              />
              <Label htmlFor={i} className="capitalize cursor-pointer">
                {i}
              </Label>
            </div>
            {isActiveDay ? (
              <TimeRange
                dayCode={daysCode[i]}
                slots={timeSlots[daysCode[i]]}
                handleUpdateStartTimeSlot={handleUpdateStartTimeSlot}
                handleUpdateEndTimeSlot={handleUpdateEndTimeSlot}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default TimeSlot;
