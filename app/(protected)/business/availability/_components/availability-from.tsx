"use client";
import React, { useState } from "react";
import TimeSlot from "./time-slot";
import {
  getTimeSlotsFromDate,
  getTimeSlotsFromTime,
} from "../_utils/initializeAvailability";
import TimezoneSelect from "@/components/shared/timezone-select";
import { ITimezoneOption } from "react-timezone-select";
import AvailabilityHeader from "./availability-header";
import {
  createAvailabilitySchemaType,
  getAvailabilityDetailType,
} from "@/actions/_utils/types.type";
import { updateAvailability } from "@/actions/(protected)/availability/updateAvailability";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";

type propType = {
  data: getAvailabilityDetailType["data"];
};

const AvailabilityForm = (props: propType) => {
  const { data: availabilityDetail } = props;
  const params = useParams();
  const data = availabilityDetail!;
  const {
    days: activeDays,
    availability: selectedSlots,
    timezone: availabilityTimeZone,
    default: isAvailabilityDefault,
    name: availabilityName,
  } = data;

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isDefault, setIsDefault] = useState(isAvailabilityDefault!);
  const [name, setName] = useState(availabilityName!);
  const [timezone, setTimeZone] = useState(availabilityTimeZone!);
  const [days, setDays] = useState(activeDays as number[]);
  const [timeSlots, setTimeSlots] = useState(
    getTimeSlotsFromTime(
      selectedSlots as createAvailabilitySchemaType["availability"]
    )
  );

  const handleChangeTimezone = (value: ITimezoneOption) => {
    setTimeZone(value.value);
  };

  const handleUpdateAvailability = async () => {
    setLoading(true);
    const res = await updateAvailability({
      availabilityId: params.availability_id as string,
      values: {
        timezone: timezone,
        availability: getTimeSlotsFromDate(timeSlots),
        days: days,
        default: isDefault,
        name: name,
      },
    });
    if (res && !res.success) {
      toast({
        title: res.error,
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <AvailabilityHeader
        handleUpdateAvailability={handleUpdateAvailability}
        loading={loading}
        name={name}
        isDefault={isDefault}
        setName={setName}
        setIsDefault={setIsDefault}
        alreadyDefault={isAvailabilityDefault ?? false}
      />
      <div className="flex gap-5 flex-col lg:flex-row">
        <TimeSlot
          days={days}
          timeSlots={timeSlots}
          setDays={setDays}
          setTimeSlots={setTimeSlots}
        />
        <div className="lg:w-[300px] xl:w-[400px]">
          <div className="max-w-full lg:max-w-[300px] mr-auto mb-1">
            <Label>Timezone</Label>
            <TimezoneSelect value={timezone} onChange={handleChangeTimezone} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityForm;
