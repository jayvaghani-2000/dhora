import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getProfile = async (username: string) => {
  return await db.query.users.findFirst({
    where: eq(users.username, username),
    columns: {
      email: true,
      first_name: true,
      last_name: true,
      username: true,
      id: true,
      verified: true,
    },
  });
};
