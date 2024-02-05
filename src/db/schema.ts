import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: varchar("email", { length: 256 }),
  username: varchar("username", { length: 256 }),
  password: text("password"),
});
