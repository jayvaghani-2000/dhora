import { daysCode } from "./enum";

export const allowedImageType = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
];
export const allowedVideoType = ["video/webm", "video/mp4"];

export const PLATFORM_FEE = 2;

export const weekDays: (keyof typeof daysCode)[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
