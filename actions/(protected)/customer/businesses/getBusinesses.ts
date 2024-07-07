"use server";

import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { validateToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { BusinessesType } from "./_utils/getBusiness.type";
import { businessFilter } from "@/actions/_utils/types.type";
import { current } from "@reduxjs/toolkit";

type paramsType = {
  filter: {
    search: string;
    sort: string;
    category: string;
    city: string;
    current_page: number;
  };
};

const BusinessInPage = 20;

const handler = async (user: User, params: paramsType) => {
  const { filter = {} as paramsType["filter"] } = params ?? {};
  const { search, category, sort, city, current_page = 1 } = filter;

  try {
    const data = await db.execute(sql`SELECT
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
      `);

    let filteredData = data as unknown as BusinessesType[];

    // filter out login user
    if(user.business_id) {
      filteredData = filteredData.filter(b =>
        b.id !== user.business_id
      );
    }

    // Apply search filter
    if (search) {
      filteredData = filteredData.filter(b =>
        b.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply category filter
    if (category) {
      filteredData = filteredData.filter(b => b.type === category);
    }

    // Apply city filter
    if (city) {
      filteredData = filteredData.filter(b => {
        const cityLowerCase = city.toLowerCase();
        return (
          b.address?.toLowerCase().includes(cityLowerCase) ||
          cityLowerCase.includes(b.address?.toLowerCase())
        );
      });
    }

    if (sort) {
      switch (sort) {
        case "Top Rated":
          filteredData.sort(
            (a, b) =>
              b.rating_info.average_rating - a.rating_info.average_rating
          );
          break;
        case "A-Z":
          filteredData.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "Z-A":
          filteredData.sort((a, b) => b.name.localeCompare(a.name));
          break;
        // Add other sort cases if needed
      }
    }

    const totalPage = Math.ceil(data.length / BusinessInPage);

    const currentPageData = filteredData.splice(
      BusinessInPage * (current_page - 1),
      BusinessInPage
    );

    return {
      success: true as true,
      data: {
        data: currentPageData as unknown as BusinessesType[],
        pages: { total_pages: totalPage },
      } as {
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
