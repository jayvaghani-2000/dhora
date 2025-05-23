import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import "./event-schedule.css";
import Events from "../events";
import { dateWithoutTime, getDateTimeFormatted, timeZone } from "@/lib/common";
import {
  addDays,
  differenceInDays,
  format,
  getDay,
  isWithinInterval,
} from "date-fns";
import { DatesSetArg, EventInput } from "@fullcalendar/core/index.js";
import EditSubEvent from "../edit-sub-event";
import { getSubEventsType } from "@/actions/_utils/types.type";

const EventSchedule = (props: React.ComponentProps<typeof Events>) => {
  const selectedDates = useRef<DatesSetArg>({} as DatesSetArg);
  const { event, subEvents } = props;
  const [selectedEvent, setSelectedEvent] = useState({
    open: false,
    data: [] as getSubEventsType["data"],
  });
  const [rerender, setRerender] = useState(1);

  const { from_date, to_date, single_day_event } = event!;

  const calendarEvents: EventInput[] =
    subEvents?.map(i => {
      return {
        id: i.id,
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

  useEffect(() => {
    setRerender(prev => prev + 1);
  }, []);

  useEffect(() => {
    const button = document.querySelector(".fc-prev-button");

    const handleClick = () => {
      setRerender(prev => prev + 1);
    };

    if (button) {
      button.addEventListener("click", handleClick);

      return () => {
        button.removeEventListener("click", handleClick);
      };
    }
  }, []);

  useEffect(() => {
    const button = document.querySelector(".fc-next-button");
    const handleClick = () => {
      setRerender(prev => prev + 1);
    };

    if (button) {
      button.addEventListener("click", handleClick);

      return () => {
        button.removeEventListener("click", handleClick);
      };
    }
  }, []);

  const enableDays = (() => {
    return calendarEvents.map(i => {
      const inRange = isWithinInterval(new Date(i.start as Date), {
        start: selectedDates.current.startStr,
        end: selectedDates.current.endStr,
      });

      if (inRange) {
        return getDay(i.start as Date);
      } else {
        return false;
      }
    });
  })();

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView={single_day_event ? "timeGridDay" : "timeGridWeek"}
        weekends={true}
        headerToolbar={{
          left: single_day_event ? "" : "prev,next",
          center: "title",
          right: single_day_event ? "" : "timeGridWeek,timeGridDay",
        }}
        events={calendarEvents}
        allDaySlot={false}
        eventClick={event => {
          setSelectedEvent({
            open: true,
            data: subEvents?.filter(i => i.id === event.event._def.publicId),
          });
        }}
        datesSet={dates => {
          selectedDates.current = dates;
        }}
        validRange={{
          start: dateWithoutTime(from_date!),
          end:
            single_day_event || from_date === to_date
              ? addDays(from_date!, 1)
              : dateWithoutTime(addDays(to_date!, 1)),
        }}
        dayHeaderContent={args => {
          const day = differenceInDays(args.date, from_date!) + 1;

          const haveAnyEventOnTheDay = calendarEvents.find(
            i => getDay(new Date(i.start as string)) === getDay(args.date)
          );

          return {
            html: `<div><div style="position: absolute; inset: 0; background-color: ${haveAnyEventOnTheDay ? "#3f3f46" : "transparent"};z-index: 0;"></div><div style="position: relative;"><p style="font-size: 12px;">Day ${day}<p>
          <div  style="font-size: 12px;color: #a1a1aa">${format(args.date, "eee, d MMM")}<div>
          </div><div>`,
          };
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
