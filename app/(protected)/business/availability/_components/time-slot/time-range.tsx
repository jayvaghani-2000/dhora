import React from "react";
import dayjs, { ConfigType } from "@/lib/dayjs";
import TimePicker from "./time-picker";
import { Button } from "@/components/ui/button";
import { GoPlus } from "react-icons/go";
import { IoMdCopy } from "react-icons/io";
import { initializeAvailability } from "../../_utils/initializeAvailability";
import { RiDeleteBin6Line } from "react-icons/ri";

type propType = {
  slots: ReturnType<typeof initializeAvailability>["timeSlots"][0];
  dayCode: number;
  handleUpdateStartTimeSlot: (
    value: number,
    dayIndex: number,
    slotIndex: number
  ) => void;
  handleUpdateEndTimeSlot: (
    value: number,
    dayIndex: number,
    slotIndex: number
  ) => void;
};

const TimeRange = (props: propType) => {
  const { slots, handleUpdateEndTimeSlot, handleUpdateStartTimeSlot, dayCode } =
    props;

  return (
    <div>
      {slots.map((i, index) => {
        const date = dayjs(slots[index].start_time);
        const endDate = dayjs(slots[index].end_time);

        return (
          <div className="flex gap-3 items-center" key={i.id}>
            <div className="flex gap-2 items-center">
              <TimePicker
                value={date}
                max={endDate}
                onChange={value => {
                  handleUpdateStartTimeSlot(value, dayCode, index);
                }}
              />
              <span>-</span>
              <TimePicker
                value={endDate}
                min={date}
                onChange={value => {
                  handleUpdateEndTimeSlot(value, dayCode, index);
                }}
              />
            </div>
            {index === 0 ? (
              <>
                <Button variant="outline">
                  <GoPlus size={18} />
                </Button>
                <Button variant="outline">
                  <IoMdCopy size={18} />
                </Button>
              </>
            ) : (
              <Button variant="destructive">
                <RiDeleteBin6Line size={18} />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TimeRange;
