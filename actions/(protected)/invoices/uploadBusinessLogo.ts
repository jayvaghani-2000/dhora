"use server";

import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { minioClient } from "../../_utils/minio";

const handler = async (user: User, file: FormData) => {
  try {
    const image = file.get("image") as File;
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    minioClient.putObject(
      "business",
      `${user.business_id?.toString()}/${image.name}`,
      buffer,
      function (err, etag) {
        minioClient.presignedGetObject(
          "business",
          `${user.business_id?.toString()}/${image.name}`,
          24 * 60 * 60,
          function (err, presignedUrl) {
            if (err) return console.log(err);
            console.log(presignedUrl);
          }
        );

        return console.log(err, etag);
      }
    );

    // var stream = minioClient.listObjects("business", "", true);

    // stream.on("data", function (obj) {
    //   console.log(obj);
    // });

    // minioClient.presignedGetObject(
    //   "business",
    //   "hello-file",
    //   20,
    //   function (err, presignedUrl) {
    //     if (err) return console.log(err);
    //     console.log(presignedUrl);
    //   }
    // );

    // minioClient.bucketExists("stage", function (err, exists) {
    //   if (err) {
    //     return console.log(err, "++++++++", exists);
    //   }
    //   if (exists) {
    //     return console.log("Bucket exists.");
    //   }
    // });

    return { success: true as true, data: {} };
  } catch (err) {
    return errorHandler(err);
  }
};

export const uploadBusinessLogo: (
  file: FormData
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
