import sharp from "sharp";

export const assetsMetadata = async (buffer: Buffer) => {
  const meta = await sharp(buffer).metadata();
  const img = sharp(buffer);

  const preview = await img.resize({ width: 40, height: 40 }).toBuffer();
  const dataUrl = `data:image/${meta.format};base64,${preview.toString("base64")}`;

  return {
    height: meta.height,
    width: meta.width,
    blurUrl: dataUrl,
    type: meta.format,
  };
};
