import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "stage", "production"]),
    DATABASE_URL: z.string(),
    AUTH_SECRET: z.string(),
    HOST_URL: z.string(),
    SENDGRID_API_KEY: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    DOCU_SEAL: z.string(),
  },
  runtimeEnv: process.env,
});

export const config = {
  env,
};
