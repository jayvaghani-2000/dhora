"use server";
import { User } from "lucia";
import {
  bookings,
  bookingsAddOns,
  bookingsPackages,
  bookingsSubEvents,
} from "@/db/schema";
import { db } from "@/lib/db";
import dayjs from "@/lib/dayjs";
import { validateToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { z } from "zod";
import { createCallSchema } from "@/lib/schema";

type parmaTypes = {
  businessId: string;
  time: string;
  duration: number;
  event: z.infer<typeof createCallSchema>;
};

const handler = async (user: User, params: parmaTypes) => {
  if (params.businessId === user.business_id) {
    throw new Error("You can't create booking with yourself");
  }
  const { businessId, time, duration, event } = params;

  console.log(params)

  const { add_on_id, event_id, package_id, sub_event_id } = event;

  try {
    await db.transaction(async tx => {
      const booking = await tx
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

      await Promise.all([
        sub_event_id.length > 0 ? await tx
          .insert(bookingsSubEvents)
          .values(
            sub_event_id.map(i => ({
              booking_id: booking[0].id,
              sub_event_id: i,
            }))
          )
          .returning() : () =>{},
        package_id.length > 0 ? await tx
          .insert(bookingsPackages)
          .values(
            package_id.map(i => ({
              booking_id: booking[0].id,
              package_id: i,
            }))
          )
          .returning(): () =>{},
         add_on_id.length > 0 ? await tx
          .insert(bookingsAddOns)
          .values(
            add_on_id.map(i => ({
              booking_id: booking[0].id,
              add_on_id: i,
            }))
          )
          .returning():() =>{},
      ]);
    });

    return {
      success: true as true,
      data: "Booking created successfully.",
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const createBooking: (
  params: parmaTypes
) => Promise<Awaited<ReturnType<typeof handler>>> = validateToken(handler);
