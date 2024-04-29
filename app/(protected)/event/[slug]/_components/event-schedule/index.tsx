import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import "./event-schedule.css";
import Events from "../events";
import { dateWithoutTime, getDateTimeFormatted, timeZone } from "@/lib/common";
import { addDays } from "date-fns";
import { EventInput } from "@fullcalendar/core/index.js";

const EventSchedule = (props: React.ComponentProps<typeof Events>) => {
  const { event, subEvents } = props;

  const { from_date, to_date, single_day_event } = event!;

  const calendarEvents: EventInput[] =
    subEvents?.map(i => {
      return {
        id: i.id as unknown as string,
        title: i.title,
        start: getDateTimeFormatted(
          dateWithoutTime(i.event_date),
          i.start_time
        ),
        end: getDateTimeFormatted(dateWithoutTime(i.event_date), i.end_time),
        borderColor: "#3f3f46",
        backgroundColor: "#3f3f46",
        textColor: "#fff",
      };
    }) ?? [];

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
      initialView="timeGridDay"
      weekends={true}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "timeGridWeek,timeGridDay",
      }}
      events={calendarEvents}
      allDaySlot={false}
      eventClick={() => {
        console.log("Click");
      }}
      validRange={{
        start: dateWithoutTime(from_date!),
        end:
          single_day_event || from_date === to_date
            ? addDays(from_date!, 1)
            : dateWithoutTime(addDays(to_date!, 1)),
      }}
      timeZone={timeZone}
    />
  );
};

export default EventSchedule;
