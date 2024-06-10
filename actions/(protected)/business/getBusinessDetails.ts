"use server";

import { validateToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { db } from "@/lib/db";
import { and, desc, eq, inArray } from "drizzle-orm";
import {
  addOns,
  addOnsGroups,
  assets,
  bookingTypes,
  businesses,
  packageGroups,
  packages,
} from "@/db/schema";

const getBusinessDetailHandler = async (user: User, businessId?: string) => {
  const businessDetail = await db.query.businesses.findFirst({
    where: and(
      eq(businesses.id, businessId ? businessId : (user.business_id as string)),
      eq(businesses.deleted, false)
    ),
    with: {
      assets: {
        where: inArray(assets.asset_type, [
          "business_assets",
          "package_assets",
        ]),
        orderBy: [desc(assets.created_at)],
      },
      package_groups: {
        where: eq(packageGroups.deleted, false),
      },
      packages: {
        where: eq(packages.deleted, false),
        with: {
          assets: true,
        },
        orderBy: [desc(packages.updated_at)],
      },
      add_on_groups: {
        where: eq(addOnsGroups.deleted, false),
      },
      add_ons: {
        where: eq(addOns.deleted, false),
      },
      booking_types: {
        where: eq(bookingTypes.deleted, false),
      },
      ratings: true,
    },
  });

  return businessDetail!;
};

const handler = async (user: User, businessId?: string) => {
  try {
    const businessDetail = await getBusinessDetailHandler(user, businessId);

    if (!businessDetail) {
      throw new Error("Business not found!");
    }
    return { success: true as true, data: businessDetail! };
  } catch (err) {
    return {
      ...errorHandler(err),
      data: {} as NonNullable<
        Awaited<ReturnType<typeof getBusinessDetailHandler>>
      >,
    };
  }
};

export const getBusinessDetails: (
  businessId?: string
) => Promise<Awaited<ReturnType<typeof handler>>> = validateToken(handler);
