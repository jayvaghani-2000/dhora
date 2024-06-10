"use server";
import { User } from "lucia";
import {
  availability,
  bookings,
  bookingsAddOns,
  bookingsPackages,
  bookingsSubEvents,
  events,
  users,
} from "@/db/schema";
import { db } from "@/lib/db";
import dayjs from "@/lib/dayjs";
import { validateToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { z } from "zod";
import { createCallSchema } from "@/lib/schema";
import { meetingMail } from "@/actions/(auth)/_utils/meetingMail";
import { eq } from "drizzle-orm";

type paramTypes = {
  businessId: string;
  time: string;
  duration: number;
  event: z.infer<typeof createCallSchema>;
  availability_id: string;
  customer_timezone: string;
};

const handler = async (user: User, params: paramTypes) => {
  if (params.businessId === user.business_id) {
    throw new Error("You can't create booking with yourself");
  }
  const {
    businessId,
    time,
    duration,
    event,
    availability_id,
    customer_timezone,
  } = params;

  const { add_on_id, event_id, package_id, sub_event_id } = event;

  try {
    await db.transaction(async tx => {
      const [booking] = await tx
        .insert(bookings)
        .values({
          business_id: businessId,
          time: time,
          duration: duration,
          end: dayjs(time).utc().add(duration, "minutes").utc().format(),
          customer_id: user.id,
          event_id: event_id,
        })
        .returning();

      console.log(booking, sub_event_id, package_id, add_on_id);

      await Promise.all([
        sub_event_id.length > 0
          ? await tx
              .insert(bookingsSubEvents)
              .values(
                sub_event_id.map(i => ({
                  booking_id: booking.id,
                  sub_event_id: i,
                }))
              )
              .returning()
          : () => {},
        package_id.length > 0
          ? await tx
              .insert(bookingsPackages)
              .values(
                package_id.map(i => ({
                  booking_id: booking.id,
                  package_id: i,
                }))
              )
              .returning()
          : () => {},
        add_on_id.length > 0
          ? await tx
              .insert(bookingsAddOns)
              .values(
                add_on_id.map(i => ({
                  booking_id: booking.id,
                  add_on_id: i,
                }))
              )
              .returning()
          : () => {},
      ]);

      const businessUser = await db.query.users.findFirst({
        where: eq(users.business_id, businessId),
      });

      const getEvent = await db.query.events.findFirst({
        columns: {
          title: true,
        },
        where: eq(events.id, event_id),
      });

      const getPakages = await db.query.packages.findMany({
        columns: {
          name: true,
        },
        where: (fields, operators) => operators.inArray(fields.id, package_id),
      });

      const getBusinessTimeZone = await db.query.availability.findFirst({
        columns: {
          timezone: true,
        },
        where: eq(availability.id, availability_id),
      });

      meetingMail(
        booking.id,
        { startTime: booking.time!, endTime: booking.end! },
        getBusinessTimeZone?.timezone!,
        { organizationMail: businessUser?.email!, customerMail: user.email },
        businessUser?.email!,
        getPakages,
        getEvent?.title!
      );

      meetingMail(
        booking.id,
        { startTime: booking.time!, endTime: booking.end! },
        customer_timezone,
        { organizationMail: businessUser?.email!, customerMail: user.email },
        user.email,
        getPakages,
        getEvent?.title!
      );
    });

    return {
      success: true as true,
      data: "Booking created successfully.",
    };
  } catch (err) {
    console.log(err);
    return errorHandler(err);
  }
};

export const createBooking: (
  params: paramTypes
) => Promise<Awaited<ReturnType<typeof handler>>> = validateToken(handler);
