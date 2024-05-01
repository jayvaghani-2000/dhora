import React from "react";
import Events from "../_components/events";
import { getEventDetails } from "@/actions/(protected)/customer/events/getEventDetails";
import { getSubEvents } from "@/actions/(protected)/customer/sub-events/getSubEvents";

type propType = { params: { slug: string } };

export default async function EventSetup(props: propType) {
  const [event, subEvents] = await Promise.all([
    await getEventDetails(props.params.slug),
    await getSubEvents(props.params.slug),
  ]);

  if (!event.success) {
    return <div className="text-center">{event.error}</div>;
  }

  return <Events event={event.data} subEvents={subEvents.data} />;
}
