"use client";
import React, { useState } from "react";
import UploadAssets from "./upload-assets";
import { getBusinessAssetsType } from "@/actions/_utils/types.type";
import { MotionImage } from "@/components/shared/MotionImage";
import { allowedImageType } from "@/lib/constant";

type propTypes = {
  assets: getBusinessAssetsType;
};

const AssetsManagement = (props: propTypes) => {
  const [assets, setAssets] = useState<getBusinessAssetsType["data"]>(
    props.assets.data ?? []
  );

  return (
    <div>
      <div className="text-secondary-light-gray font-semibold text-base ">
        Assets Management
      </div>

      <div className="relative my-2 w-fit">
        <UploadAssets setAssets={setAssets} />
      </div>
      <div className="columns-2 lg:columns-3 gap-x-2  lg:gap-x-3">
        {assets?.map(i =>
          allowedImageType.includes(i.type ?? "") ? (
            <div
              key={i.id}
              className="relative rounded-sm mb-2 lg:mb-3 overflow-hidden"
              style={{
                aspectRatio: i.width && i.height ? i.width / i.height : 1,
              }}
            >
              <MotionImage
                src={i.url ?? ""}
                alt={i.id as unknown as string}
                fill
                style={{ objectFit: "contain" }}
                blurDataURL={i.blur_url ?? ""}
                placeholder="blur"
                className="rounded-sm"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          ) : (
            <div
              key={i.id}
              className="relative rounded-sm mb-2 lg:mb-3 h-full"
              style={{
                aspectRatio: i.width && i.height ? i.width / i.height : 1,
              }}
            >
              <video
                src={i.url ?? ""}
                className="object-cover rounded-sm w-full h-full"
                controls
                onPlay={e => e.stopPropagation()}
                onPause={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AssetsManagement;
