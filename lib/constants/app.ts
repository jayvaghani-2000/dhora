import { env } from "next-runtime-env";

export const NEXT_PUBLIC_WEBAPP_URL = () => env("NEXT_PUBLIC_WEBAPP_URL");

export const APP_DOCUMENT_UPLOAD_SIZE_LIMIT =
  Number(process.env.NEXT_PUBLIC_DOCUMENT_SIZE_UPLOAD_LIMIT) || 50;

export const WEBAPP_BASE_URL =
  NEXT_PUBLIC_WEBAPP_URL() ?? "http://localhost:3000";
