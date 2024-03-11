import { config } from "@/config";
import * as Minio from "minio";
import { getBigIntId } from "./db";
import { assetsMetadata } from "@/actions/_utils/assetsMetadata";

const mc = new Minio.Client({
  endPoint: config.env.S3_HOST,
  accessKey: config.env.S3_ACCESS_KEY,
  secretKey: config.env.S3_SECRET_KEY,
});

export function generatePublicAccess(business_id: bigint) {
  return {
    Effect: "Allow",
    Principal: {
      AWS: ["*"],
    },
    Action: ["s3:GetObject"],
    Resource: [`arn:aws:s3:::${config.env.NODE_ENV}/${business_id}/public/**`],
  };
}

export async function setPublicPolicy(business_id: bigint) {
  const policyString = await mc.getBucketPolicy(
    config.env.NODE_ENV.toLowerCase()
  );
  const policy = JSON.parse(policyString);
  policy.Statement.push(generatePublicAccess(business_id));
  await mc.setBucketPolicy(config.env.NODE_ENV, JSON.stringify(policy));
}

export async function createPublicBusinessImgUrl(
  business_id: bigint,
  img: File
) {
  const buffer = Buffer.from(await img.arrayBuffer());
  const metadata = await assetsMetadata(buffer);
  const id = (await getBigIntId)[0].id_generator;
  const filepath = `${business_id}/public/${id}.${metadata.type?.toLowerCase()}`;
  await mc.putObject(config.env.NODE_ENV, filepath, buffer);
  await setPublicPolicy(business_id);
  return `https://cdn.dhora.app/${config.env.NODE_ENV}/${filepath}`;
}

export async function removeImage(url: string) {
  const domain = `https://cdn.dhora.app/${config.env.NODE_ENV}/`;

  const imageObject = url.replace(domain, "");

  await mc.removeObjects(config.env.NODE_ENV, [imageObject]);
}
