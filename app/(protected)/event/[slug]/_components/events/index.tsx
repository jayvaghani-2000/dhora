"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { PiPlus } from "react-icons/pi";
import CreateSubEvent from "../create-sub-event";
import {
  getEventDetailsType,
  getSubEventsType,
} from "@/actions/_utils/types.type";
import EventSchedule from "../event-schedule";

type propType = {
  event: getEventDetailsType["data"];
  subEvents: getSubEventsType["data"];
};

const Events = (props: propType) => {
  const { event } = props;
  const [createSubEvent, setCreateSubEvent] = useState(false);

  return (
    <div>
      <div className="flex justify-between gap-5 items-center">
        <div className="text-secondary-light-gray font-semibold text-base ">
          Itinerary
        </div>
        <Button
          onClick={() => {
            setCreateSubEvent(true);
          }}
          className="text-xs lg:text-sm p-2 h-fit lg:px-4"
        >
          <PiPlus size={16} className="mr-2" />
          Create Itinerary
        </Button>
      </div>
      <div className="mt-4 lg:mt-6">
        <EventSchedule {...props} />
      </div>
      <CreateSubEvent
        open={createSubEvent}
        setOpen={setCreateSubEvent}
        event={event}
      />
    </div>
  );
};

export default Events;
