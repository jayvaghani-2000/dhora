"use server";

import { validateToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { db } from "@/lib/db";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import {
  addOns,
  addOnsGroups,
  assets,
  bookingTypes,
  businesses,
  packageGroups,
  packages,
  ratings,
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
      ratings: {
        with: {
          customer: {
            columns: {
              name: true,
              image: true,
            },
          }
        }
      },

    },
  });

  const businessRatings = await db.execute(sql`SELECT 
    COALESCE(COUNT(*), 0) AS total_ratings,
    COALESCE(AVG(rating), 0) AS average_rating,
    COALESCE(SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END), 0) AS count_rating_1,
    COALESCE(SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END), 0) AS count_rating_2,
    COALESCE(SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END), 0) AS count_rating_3,
    COALESCE(SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END), 0) AS count_rating_4,
    COALESCE(SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END), 0) AS count_rating_5
FROM 
    ratings 
WHERE 
    business_id = ${businessId ?? (user.business_id as string)};
`);
  return businessDetail
    ? {
      ...businessDetail,
      rating_summary: (businessRatings ?? {
        total_ratings: 0,
        average_rating: "0.0",
        count_rating_1: 0,
        count_rating_2: 0,
        count_rating_3: 0,
        count_rating_4: 0,
        count_rating_5: 0,
      }) as unknown as[{
        total_ratings: number;
        average_rating: string;
        count_rating_1: number;
        count_rating_2: number;
        count_rating_3: number;
        count_rating_4: number;
        count_rating_5: number;
      }],
    }
    : null;
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
