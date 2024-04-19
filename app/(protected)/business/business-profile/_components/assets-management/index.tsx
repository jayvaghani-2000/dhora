"use client";
import React, { useState } from "react";
import UploadAssets from "./upload-assets";
import { getBusinessAssetsType } from "@/actions/_utils/types.type";
import { MotionImage } from "@/components/shared/MotionImage";
import { allowedImageType } from "@/lib/constant";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type propTypes = {
  assets: getBusinessAssetsType;
};

const AssetsManagement = (props: propTypes) => {
  const [assets, setAssets] = useState<getBusinessAssetsType["data"]>(
    props.assets.data ?? []
  );

  return (
    <div>
      <div className="text-secondary-light-gray font-semibold text-base">
        Assets Management
      </div>
      <ScrollArea className=" border rounded-md border-divider mt-2">
        <div className="p-4 flex gap-2">
          <UploadAssets setAssets={setAssets} />
          {assets?.map(i =>
            allowedImageType.includes(i.type ?? "") ? (
              <div
                key={i.id}
                className="relative h-[120px]  md:h-[140px] rounded-sm flex flex-col justify-center items-center"
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
                className="relative h-[120px]  md:h-[140px] rounded-sm flex flex-col justify-center items-center"
                style={{
                  aspectRatio: i.width && i.height ? i.width / i.height : 1,
                }}
              >
                <video
                  src={i.url ?? ""}
                  className="object-cover rounded-sm"
                  controls
                  onPlay={e => e.stopPropagation()}
                  onPause={e => e.stopPropagation()}
                  onMouseDown={e => e.stopPropagation()}
                />
              </div>
            )
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default AssetsManagement;
