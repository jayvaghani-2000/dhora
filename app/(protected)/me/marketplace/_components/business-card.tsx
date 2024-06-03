import { getBusinessesType } from "@/actions/_utils/types.type";
import { MotionImage } from "@/components/shared/MotionImage";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React from "react";
import StarRating from "./star-rating";
import RichEditor from "@/components/shared/rich-editor";
import { CiLocationOn } from "react-icons/ci";
import Link from "next/link";
import { allowedImageType } from "@/lib/constant";
import { IoMdPlayCircle } from "react-icons/io";

type propsType = {
  business: getBusinessesType["data"]["data"][0];
};

const BusinessCard = (props: propsType) => {
  const { business } = props;

  return (
    <div>
      <Carousel className="w-full mx-auto">
        <CarouselContent>
          {business.assets.map((asset, index) => (
            <CarouselItem key={index} className="bg-primary-gray rounded-sm">
              {allowedImageType.includes(asset.type ?? "") ? (
                <div
                  key={asset.id}
                  className="relative rounded-sm  overflow-hidden mx-auto"
                  style={{
                    aspectRatio:
                      asset.width && asset.height
                        ? asset.width / asset.height
                        : 1,
                    height: "200px",
                    maxWidth: "100%",
                  }}
                >
                  <MotionImage
                    src={asset.url}
                    alt={asset.id}
                    fill
                    style={{ objectFit: "contain" }}
                    blurDataURL={asset.blur_url}
                    placeholder="blur"
                    className="rounded-sm"
                  />
                </div>
              ) : (
                <div
                  key={asset.id}
                  className="relative rounded-sm h-full  mx-auto"
                  style={{
                    aspectRatio:
                      asset.width && asset.height
                        ? asset.width / asset.height
                        : 1,
                    height: "200px",
                    maxWidth: "100%",
                  }}
                >
                  <div className="absolute inset-0 flex justify-center items-center  mx-auto">
                    <IoMdPlayCircle className="h-8 w-8" />
                  </div>
                  <video
                    src={asset.url ?? ""}
                    className="object-cover rounded-sm w-full h-full"
                    controls={false}
                    onPlay={e => e.stopPropagation()}
                    onPause={e => e.stopPropagation()}
                    onMouseDown={e => e.stopPropagation()}
                  />
                </div>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <Link
        className="my-2 w-full flex flex-col gap-2 px-2 sm:px-0"
        href={`/@me/marketplace/${business.id}`}
      >
        <p className="text-xl font-bold">{business.name}</p>
        <div className="flex items-center gap-1 text-white text-xs">
          <CiLocationOn className="h-4 w-4" />
          <p>{business.address}</p>
        </div>
        <div className="w-full text-sm my-1 text-gray-500">
          <RichEditor value={business.description} readOnly />
        </div>
        <div className="flex items-center justify-between w-full flex-wrap">
          <div className="flex gap-1 items-center">
            <StarRating
              rating={business.rating_info.average_rating}
              maxRating={5}
            />
            <p>({business.rating_info.total_ratings})</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BusinessCard;
