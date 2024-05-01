"use server";

import { User } from "lucia";
import { validateToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { availability } from "@/db/schema";
import { createAvailabilitySchemaType } from "@/actions/_utils/types.type";
import { getTimezoneDate } from "@/lib/schedule";
import { uniq } from "lodash";

type parmaTypes = {
  timezone: string;
  availabilityId: string;
};

const handler = async (user: User, params: parmaTypes) => {
  const { timezone, availabilityId } = params;

  const availabilityDetail = await db.query.availability.findFirst({
    where: and(
      eq(availability.deleted, false),
      eq(availability.id, BigInt(availabilityId))
    ),
  });

  if (timezone === availabilityDetail!.timezone) {
    return {
      success: true,
      data: availabilityDetail!.days,
    };
  }
  try {
    const days = (
      availabilityDetail!
        .availability as createAvailabilitySchemaType["availability"]
    ).reduce((prev, curr, index) => {
      curr.forEach(i => {
        prev.push(
          getTimezoneDate({
            day: index,
            time: i.start_time,
            current: availabilityDetail!.timezone!,
            output: timezone,
          })
        );
        prev.push(
          getTimezoneDate({
            day: index,
            time: i.end_time,
            current: availabilityDetail!.timezone!,
            output: timezone,
          })
        );
      });
      return prev;
    }, [] as number[]);

    return {
      success: true,
      data: uniq(days),
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getActiveDays: (
  params: parmaTypes
) => Promise<Awaited<ReturnType<typeof handler>>> = validateToken(handler);
