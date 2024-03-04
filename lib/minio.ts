import { config } from "@/config";
import * as Minio from "minio";
import { getBigIntId } from "./db";
import { assetsMetadata } from "@/actions/_utils/assetsMetadata";

const mc = new Minio.Client({
  endPoint: config.env.S3_HOST,
  accessKey: config.env.S3_ACCESS_KEY,
  secretKey: config.env.S3_SECRET_KEY,
});

export const createPublicImg = async (business_id: bigint, img: File) => {
  const buffer = Buffer.from(await img.arrayBuffer());
  const metadata = await assetsMetadata(buffer);
  const filepath = `${business_id}/${(await getBigIntId)[0].id}.${metadata.type}`;
  await mc.putObject("public", filepath, buffer);
  return `https://cdn.dhora.app/public/${filepath}`;
};
