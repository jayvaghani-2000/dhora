"use server";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { errorType } from "@/actions/_utils/types.type";
import { validateToken } from "@/actions/_utils/validateToken";
import { bookings, users } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { AccessToken } from "livekit-server-sdk";
import { User } from "lucia";

const handler = async (user: User, bookingId: string) => {
  try {
    const data = await db.query.bookings.findFirst({
      where: eq(bookings.id, bookingId),
      with: {
        event: true,
      },
    });
    if (!data) {
      return {
        success: false,
        error: "Booking not found",
      } as errorType;
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      return {
        success: false,
        error: "Server misconfigured",
      } as errorType;
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: user.id,
      name: user.name,
    });

    at.addGrant({
      room: bookingId,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });

    return {
      success: true as true,
      data: {
        token: await at.toJwt(),
        start_time: data.time,
        end_time: data.end,
      },
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getParticipantToken: (
  bookingId: string
) => Promise<Awaited<ReturnType<typeof handler>>> = validateToken(handler);
