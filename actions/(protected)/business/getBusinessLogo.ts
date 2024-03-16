"use server";

import sharp from "sharp";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";

const handler = async (user: User, image: string) => {
  try {
    const res = await fetch(image);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const base64String = await sharp(buffer)
      .resize({ width: 150, height: 150 })
      .toFormat("jpeg")
      .toBuffer();

    const base64 = base64String.toString("base64");

    return { success: true as true, data: `data:image/jpeg;base64,${base64}` };
  } catch (err) {
    console.log(err);
    return errorHandler(err);
  }
};

export const getBusinessLogo: (
  image: string
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
