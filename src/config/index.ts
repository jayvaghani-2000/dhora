import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]),
    DATABASE_URL: z.string(),
    NEXTAUTH_SECRET: z.string(),
    NEXT_APP_URL: z.string(),
    SENDGRID_API_KEY: z.string(),
  },
  runtimeEnv: process.env,
});

export const config = {
  env,
};
