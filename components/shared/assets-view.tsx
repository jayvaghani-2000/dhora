import { assetsType } from "@/actions/_utils/types.type";
import React from "react";
import ScreenSwipe from "./screen-swipe";
import { Button } from "../ui/button";
import { FaEye } from "react-icons/fa";
import { allowedImageType } from "@/lib/constant";
import { MotionImage } from "./MotionImage";
import { IoMdPlayCircle } from "react-icons/io";

type propTypes = {
  assets: assetsType;
};

const AssetsView = (props: propTypes) => {
  const { assets } = props;

  return (
    <div className="relative max-h-[60dvh] aspect-video lg:aspect-auto rounded-lg  overflow-hidden">
      <div className="columns-2 lg:columns-3 gap-x-2  lg:gap-x-3">
        {assets.map(i =>
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
                alt={i.id}
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
              <div className="absolute inset-0 flex justify-center items-center">
                <IoMdPlayCircle className="h-16 w-16" />
              </div>
              <video
                src={i.url ?? ""}
                className="object-cover rounded-sm w-full h-full"
                controls={false}
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
            className="z-10 absolute  bottom-2 right-2 lg:bottom-4 lg:right-4 flex gap-2"
            variant="secondary"
          >
            <FaEye /> <span className="hidden lg:inline-block">See all</span>
          </Button>
        }
      >
        <div className="px-2 my-6 columns-2  gap-x-2  lg:gap-x-3 ">
          {assets.map(i =>
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
                  alt={i.id}
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
      </ScreenSwipe>
    </div>
  );
};

export default AssetsView;
