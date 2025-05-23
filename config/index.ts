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
    STRIPE_WEBHOOK_SECRET: z.string(),
    DOCU_SEAL: z.string(),
    DOCU_SEAL_EMAIL: z.string(),
    S3_HOST: z.string(),
    S3_ACCESS_KEY: z.string(),
    S3_SECRET_KEY: z.string(),
    NEXT_PUBLIC_GOOGLE_PLACES_API_KEY: z.string(),
    LIVEKIT_API_KEY: z.string(),
    LIVEKIT_API_SECRET: z.string(),
    NEXT_PUBLIC_LIVEKIT_URL: z.string(),
  },
  runtimeEnv: process.env,
});

export const config = {
  env,
};
