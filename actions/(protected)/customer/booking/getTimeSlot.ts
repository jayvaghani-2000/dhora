"use server";

import { User } from "lucia";
import { validateToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";

type parmaTypes = {
  timezone: string;
  availabilityId: string;
  date: string;
};

const handler = async (user: User, params: parmaTypes) => {
  const { timezone, availabilityId, date } = params;

  try {
  } catch (err) {
    return errorHandler(err);
  }
};

export const getTimeSlots: (
  params: parmaTypes
) => Promise<Awaited<ReturnType<typeof handler>>> = validateToken(handler);
