import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import "./event-schedule.css";
import Events from "../events";
import { dateWithoutTime, getDateTimeFormatted, timeZone } from "@/lib/common";
import { addDays, getDay } from "date-fns";
import { EventInput } from "@fullcalendar/core/index.js";
import EditSubEvent from "../edit-sub-event";
import { getSubEventsType } from "@/actions/_utils/types.type";

const EventSchedule = (props: React.ComponentProps<typeof Events>) => {
  const { event, subEvents } = props;
  const [selectedEvent, setSelectedEvent] = useState({
    open: false,
    data: [] as getSubEventsType["data"],
  });
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

  const clearSelection = () => {
    setSelectedEvent({ open: false, data: [] });
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView={single_day_event ? "timeGridDay" : "timeGridWeek"}
        weekends={true}
        headerToolbar={{
          left: single_day_event ? "" : "prev,next today",
          center: "title",
          right: single_day_event ? "" : "timeGridWeek,timeGridDay",
        }}
        events={calendarEvents}
        allDaySlot={false}
        eventClick={event => {
          setSelectedEvent({
            open: true,
            data: subEvents?.filter(
              i => (i.id as unknown as string) === event.event._def.publicId
            ),
          });
        }}
        validRange={{
          start: dateWithoutTime(from_date!),
          end:
            single_day_event || from_date === to_date
              ? addDays(from_date!, 1)
              : dateWithoutTime(addDays(to_date!, 1)),
        }}
        timeZone={timeZone}
        firstDay={getDay(from_date!)}
      />
      {selectedEvent.open ? (
        <EditSubEvent
          event={event}
          open={selectedEvent.open}
          handleClose={clearSelection}
          subEvent={selectedEvent.data}
        />
      ) : null}
    </>
  );
};

export default EventSchedule;
