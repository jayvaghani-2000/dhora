import sharp from "sharp";

export const assetsMetadata = async (buffer: Buffer) => {
  const meta = await sharp(buffer).metadata();
  const img = sharp(buffer);

  let resizeWidth = meta.width ?? 40;
  let resizeHeight = meta.height ?? 40;

  if (resizeWidth < resizeHeight) {
    resizeWidth = 40;
    resizeHeight = Math.round(
      ((meta.height ?? 40) / (meta.width ?? 40)) * resizeWidth
    );
  } else {
    resizeHeight = 40;
    resizeWidth = Math.round(
      ((meta.width ?? 40) / (meta.height ?? 40)) * resizeHeight
    );
  }

  const preview = await img
    .resize(resizeWidth, resizeHeight, { fit: "cover" })
    .blur(3)
    .toBuffer();
  const dataUrl = `data:image/${meta.format};base64,${preview.toString("base64")}`;

  return {
    height: meta.height,
    width: meta.width,
    blur_url: dataUrl,
    type: meta.format,
  };
};
