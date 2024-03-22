import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { weekDays } from "@/lib/constant";
import { daysCode } from "@/lib/enum";
import React, { useState } from "react";
import {
  generateEndTime,
  generateStartTime,
  initializeAvailability,
  localTime,
} from "../../_utils/initializeAvailability";
import TimeRange from "./time-range";
import { v4 as uuid } from "uuid";
import { cloneDeep, uniq } from "lodash";

type propType = {
  data: ReturnType<typeof initializeAvailability>;
};

const TimeSlot = (props: propType) => {
  const { data } = props;

  const { days: activeDays, timeSlots: selectedSlots } = data;

  const [days, setDays] = useState(activeDays);
  const [timeSlots, setTimeSlots] = useState(selectedSlots);

  console.log("timeSlots", timeSlots);

  const activateDayToggle = (checked: boolean, dayCode: number) => {
    if (checked) {
      setDays(prev => {
        const updatedDays = [...prev, dayCode];
        return updatedDays.sort();
      });

      setTimeSlots(prev => {
        const updatedSlot = cloneDeep(prev);
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
        const updatedSlot = cloneDeep(prev);
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
      updatedSlot[dayCode][slotIndex].start_time = localTime(value);
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
      updatedSlot[dayCode][slotIndex].end_time = localTime(value);
      return updatedSlot;
    });
  };

  const addNewSlotToDay = (
    dates: {
      start: Date;
      end: Date;
    },
    dayCode: number,
    mode: "append" | "prepend"
  ) => {
    setTimeSlots(prev => {
      const updatedSlot = cloneDeep(prev);
      if (mode === "append") {
        updatedSlot[dayCode].push({
          end_time: localTime(dates.end),
          start_time: localTime(dates.start),
          id: uuid(),
        });
      } else {
        updatedSlot[dayCode].unshift({
          end_time: localTime(dates.end),
          start_time: localTime(dates.start),
          id: uuid(),
        });
      }
      return updatedSlot;
    });
  };

  const handleRemoveSlot = (dayCode: number, slotId: string) => {
    setTimeSlots(prev => {
      const updatedSlot = cloneDeep(prev);
      updatedSlot[dayCode] = updatedSlot[dayCode].filter(i => i.id !== slotId);
      return updatedSlot;
    });
  };

  const copySlots = (sourceDayCode: number, targetSlots: number[]) => {
    setDays(prev => uniq([...prev, ...targetSlots].sort()));
    setTimeSlots(prev => {
      const updatedSlot = cloneDeep(prev);
      targetSlots.forEach(i => {
        updatedSlot[i] = updatedSlot[sourceDayCode].map(j => ({
          ...j,
          id: uuid(),
        }));
      });
      return updatedSlot;
    });
  };

  return (
    <div className="flex-1 p-4 border border-input rounded-lg flex gap-5 flex-col">
      {weekDays.map((i: keyof typeof daysCode) => {
        const isActiveDay = days.includes(daysCode[i]);
        return (
          <div key={i} className="flex">
            <div className="w-[140px] h-10  flex items-center space-x-2">
              <Switch
                id={`${i}switch`}
                checked={isActiveDay}
                onCheckedChange={checked => {
                  activateDayToggle(checked, daysCode[i]);
                }}
              />
              <Label
                htmlFor={`${i}switch`}
                className="capitalize cursor-pointer"
              >
                {i}
              </Label>
            </div>
            {isActiveDay ? (
              <TimeRange
                dayCode={daysCode[i]}
                slots={timeSlots[daysCode[i]]}
                handleUpdateStartTimeSlot={handleUpdateStartTimeSlot}
                handleUpdateEndTimeSlot={handleUpdateEndTimeSlot}
                addNewSlotToDay={addNewSlotToDay}
                handleRemoveSlot={handleRemoveSlot}
                copySlots={copySlots}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default TimeSlot;
