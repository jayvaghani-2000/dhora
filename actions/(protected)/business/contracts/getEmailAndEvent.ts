"use server";

import { bookings, contracts } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";

const handler = async (user: User) => {
  try {
    const data = await db.query.bookings.findMany({
      where: eq(bookings.business_id, user.business_id!),
      with:{
        event:{
          columns:{
            title:true,
            id:true
          },
         
        },
        customer: {
            columns:{
                email:true
            }
        }
      }
    }); 
    return { success: true as true, data: data };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getEmailAndEvent: () => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
