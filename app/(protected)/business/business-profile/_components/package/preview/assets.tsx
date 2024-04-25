import React from "react";
import SelectedPackage from "./selected-package";
import { allowedImageType } from "@/lib/constant";
import { MotionImage } from "@/components/shared/MotionImage";

const Assets = (props: React.ComponentProps<typeof SelectedPackage>) => {
  const { selectedPackage } = props;
  const packageDetail = selectedPackage?.[0]!;
  return packageDetail.assets.length === 0 ? (
    <div className="text-center mt-2 text-white font-medium text-base">
      No assets to show.
    </div>
  ) : (
    <div className="px-3 py-2 columns-2 lg:columns-3 gap-x-2  lg:gap-x-3">
      {packageDetail.assets?.map(i =>
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
  );
};

export default Assets;
