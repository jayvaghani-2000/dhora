import { z } from "zod";

export const imageSchema = z.object({
  height: z.number(),
  width: z.number(),
  blurUrl: z.string(),
  type: z.string(),
  objectName: z.string(),
  url: z.string(),
  etag: z.string(),
});
