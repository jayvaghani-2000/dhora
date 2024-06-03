"use server";

import { db } from "@/lib/db";
import { SQL, sql } from "drizzle-orm";
import { validateToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { BusinessesType } from "./_utils/getBusiness.type";
import { businessFilter } from "@/actions/_utils/types.type";

type paramsType = {
  filter: {
    search: string;
    sort: businessFilter;
    category: string[];
  };
  page?: number;
};

const handler = async (user: User, params: paramsType) => {
  const { filter = {} as paramsType["filter"], page = 1 } = params ?? {};

  const { search = "", category = ["Apparel"], sort = "" } = filter;

  let orderClause = "";

  const searchString = `%${search}%`;

  switch (sort) {
    case "a-z":
      orderClause = "name ASC";
      break;
    case "z-a":
      orderClause = "name DESC";
      break;
    case "rating":
      orderClause = "(rating_info->>'average_rating')::float DESC NULLS LAST";

      break;
    default:
      orderClause = "id";
      break;
  }

  try {
    const data = await db.execute(sql`WITH filtered_data AS (
      SELECT
          b.*,
          (
              SELECT jsonb_agg(sub_assets.*)
              FROM (
                  SELECT a.*
                  FROM assets a
                  WHERE a.business_id = b.id
                  LIMIT 5  
              ) sub_assets
          ) AS assets,
          COALESCE(
              (
                  SELECT jsonb_build_object(
                      'total_ratings', COUNT(r.id),
                      'average_rating', AVG(r.rating)
                  )
                  FROM ratings r
                  WHERE r.business_id = b.id
                  GROUP BY r.business_id
              ),
              jsonb_build_object('total_ratings', 0, 'average_rating', 0)
          ) AS rating_info
      FROM
          business b
      LEFT JOIN
          booking_types bt ON bt.business_id = b.id
      LEFT JOIN
          packages p ON p.business_id = b.id
      WHERE
          bt.id IS NOT NULL
      AND
            b.deleted = false
      AND
        (
            (b.id <> ${user.business_id} OR b.id IS NULL)
        )
      AND
          (
              
                LOWER(b.name) LIKE LOWER(${searchString})
            OR
                b.type IN (${category}) -- Filter based on enum values array
          )
      
      GROUP BY
          b.id
      HAVING
          jsonb_agg(bt.*) IS NOT NULL
          AND
          (
              SELECT jsonb_agg(sub_assets.*)
              FROM (
                  SELECT a.*
                  FROM assets a
                  WHERE a.business_id = b.id
                  LIMIT 5  
              ) sub_assets
          ) IS NOT NULL
          AND
          jsonb_agg(p.*) IS NOT NULL
      ),
      total_records AS (
          SELECT
              COUNT(*) AS total_records
          FROM
              filtered_data
      ),
      paginated_data AS (
          SELECT
              filtered_data.*,
              CEIL(total_records.total_records::numeric / 20) AS total_pages -- Assuming 20 records per page
          FROM
              filtered_data
          CROSS JOIN
              total_records
          ORDER BY 
           ${orderClause}
          OFFSET ${(page - 1) * 20}
          LIMIT 20
      )
      SELECT
          jsonb_build_object(
              'data', jsonb_agg(paginated_data.*),
              'pages', jsonb_build_object('total_pages', (SELECT total_pages FROM paginated_data LIMIT 1))
          ) AS result
      FROM
          paginated_data;
      `);

    return {
      success: true as true,
      data: data[0].result as {
        data: BusinessesType[];
        pages: { total_pages: number };
      },
    };
  } catch (err) {
    console.log(err);
    return {
      ...errorHandler(err),
      data: {} as {
        data: BusinessesType[];
        pages: { total_pages: number };
      },
    };
  }
};

export const getBusinesses: (
  params?: paramsType
) => Promise<Awaited<ReturnType<typeof handler>>> = validateToken(handler);
