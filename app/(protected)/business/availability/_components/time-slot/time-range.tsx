import React from "react";
import dayjs, { ConfigType } from "@/lib/dayjs";
import TimePicker from "./time-picker";
import { Button } from "@/components/ui/button";
import { GoPlus } from "react-icons/go";
import {
  getDateSlotRange,
  initializeAvailability,
} from "../../_utils/initializeAvailability";
import { RiDeleteBin6Line } from "react-icons/ri";
import CopySlots from "./copy-slots";

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
  addNewSlotToDay: (
    dates: {
      start: Date;
      end: Date;
    },
    dayCode: number,
    mode: "append" | "prepend"
  ) => void;
  handleRemoveSlot: (dayCode: number, slotId: string) => void;
  copySlots: (sourceDayCode: number, targetSlots: number[]) => void;
};

const TimeRange = (props: propType) => {
  const {
    slots,
    handleUpdateEndTimeSlot,
    handleUpdateStartTimeSlot,
    addNewSlotToDay,
    handleRemoveSlot,
    dayCode,
    copySlots,
  } = props;

  return (
    <div className="flex flex-col gap-2">
      {slots.map((i, index) => {
        const date = dayjs(slots[index].start_time);
        const endDate = dayjs(slots[index].end_time);

        const lastEndDate = dayjs(slots[slots.length - 1].end_time);

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
                <Button
                  variant="outline"
                  onClick={() => {
                    const nextSlot = getDateSlotRange(lastEndDate, date);
                    if (nextSlot) {
                      if (nextSlot.append) {
                        addNewSlotToDay(nextSlot.append, dayCode, "append");
                      } else {
                        addNewSlotToDay(nextSlot.prepend, dayCode, "prepend");
                      }
                    }
                  }}
                >
                  <GoPlus size={18} />
                </Button>

                <CopySlots parentSlot={dayCode} copySlots={copySlots} />
              </>
            ) : (
              <Button
                variant="destructive"
                onClick={() => {
                  handleRemoveSlot(dayCode, i.id);
                }}
              >
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
