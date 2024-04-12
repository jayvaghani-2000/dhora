"use client";
import React from "react";
import { getBusinessAssetsType } from "@/actions/_utils/types.type";
import { MotionImage } from "@/components/shared/MotionImage";
import { allowedImageType } from "@/lib/constant";
import ScreenSwipe from "@/components/shared/screen-swipe";
import { Button } from "@/components/ui/button";
import { FaEye } from "react-icons/fa";

type propTypes = {
  assets: getBusinessAssetsType;
};

const Assets = (props: propTypes) => {
  return (
    <div>
      <div className="text-secondary-light-gray font-semibold text-base">
        Assets
      </div>
      <div className="relative max-h-[600px] overflow-hidden">
        <div className="mt-6 columns-2 lg:columns-3 gap-x-2  lg:gap-x-3">
          {props.assets.data?.map(i =>
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
                className="relative rounded-sm mb-2 lg:mb-3"
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

        <ScreenSwipe
          title="Photo Gallery"
          trigger={
            <Button
              className="z-10 absolute bottom-4 right-4 flex gap-2"
              variant="secondary"
            >
              <FaEye /> <span>See all</span>
            </Button>
          }
        >
          <div className="mt-6 columns-2  gap-x-2  lg:gap-x-3 ">
            {props.assets.data?.map(i =>
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
                  className="relative rounded-sm mb-2 lg:mb-3"
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
        </ScreenSwipe>
      </div>
    </div>
  );
};

export default Assets;
