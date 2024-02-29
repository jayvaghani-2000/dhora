"use server";

import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { minioClient } from "../../_utils/minio";
import { v4 as uuidv4 } from "uuid";
import { assetsMetadata } from "@/actions/_utils/assetsMetadata";
import { imageObjectType } from "@/actions/_utils/types.type";

function putObjectWithPresignedUrl(
  bucketName: string,
  fileObject: string,
  buffer: Buffer
) {
  return new Promise((resolve, reject) => {
    minioClient.putObject(bucketName, fileObject, buffer, (err, etag) => {
      if (err) {
        reject(err);
        return;
      }
      minioClient.presignedGetObject(
        bucketName,
        fileObject,
        (err, presignedUrl) => {
          if (err) {
            reject(err);
            return;
          }

          resolve({ presignedUrl });
        }
      );
    });
  });
}

const handler = async (user: User, file: FormData) => {
  try {
    const image = file.get("image") as File;
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const metadata = await assetsMetadata(buffer);

    const fileObject = `${user.business_id?.toString()}/${uuidv4()}.${metadata.type}`;

    const uploadedImage = (await putObjectWithPresignedUrl(
      "business",
      fileObject,
      buffer
    )) as { presignedUrl: string };

    const imageObj = {
      ...metadata,
      url: uploadedImage.presignedUrl,
      objectName: fileObject,
    };

    return { success: true as true, data: imageObj as imageObjectType };
  } catch (err) {
    return errorHandler(err);
  }
};

export const uploadBusinessLogo: (
  file: FormData
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
