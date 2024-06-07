"use server";

import { ratings } from "@/db/schema";
import { db } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import { validateBusinessToken, validateToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";

type propType = {}

const handler = async (user: User, data: any) => {
    try {
        console.log({
            rating: data.rating,
            title: data.title,
            feedback: data.feedback,
            business_id: data.business,
            customer_id: user.id,
            event_id: data.event_id
        });

        const insertedData = await db.insert(ratings)
            .values({
                rating: data.rating,
                title: data.title,
                description: data.feedback,
                business_id: data.business,
                customer_id: user.id,
                event_id: data.event_id
            })
        return { success: true as true, data: insertedData };
    } catch (err) {
        return errorHandler(err);
    }
};

export const createReviews: (props: propType) => Promise<Awaited<ReturnType<typeof handler>>> = validateToken(handler);
