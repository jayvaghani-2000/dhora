import { assetsType } from "@/actions/_utils/types.type";
import React, { useState } from "react";
import ScreenSwipe from "./screen-swipe";
import { Button } from "../ui/button";
import { FaEye } from "react-icons/fa";
import { allowedImageType } from "@/lib/constant";
import { MotionImage } from "./MotionImage";
import { IoMdPlayCircle } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { deleteAssets } from "@/actions/(protected)/business/assets/deleteAssets";
import { useToast } from "../ui/use-toast";
import Spinner from "./spinner";

type propTypes = {
  assets: assetsType;
  deletable?: boolean;
};

const AssetsView = (props: propTypes) => {
  const { assets, deletable = false } = props;
  const { toast } = useToast();

  const [deletingAssets, setDeletingAssets] = useState<string[]>([]);

  const handleDeleteAssets = async (id: string) => {
    setDeletingAssets(prev => [...prev, id]);
    const res = await deleteAssets({
      assetId: id,
      path: "/business/business-profile/assets",
    });
    if (!res.success) {
      toast({
        title: "Unable to delete media!",
      });
      setDeletingAssets(prev => prev.filter(i => i !== id));
    }
  };

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
                {deletable ? (
                  <Button
                    size={"icon"}
                    variant="destructive"
                    className="absolute top-2 right-2 z-100 h-5 w-5 md:h-8 md:w-8 z-50"
                    onClick={() => {
                      handleDeleteAssets(i.id);
                    }}
                    disabled={deletingAssets.includes(i.id)}
                  >
                    {deletingAssets.includes(i.id) ? (
                      <Spinner className="ml-0 " />
                    ) : (
                      <RiDeleteBin6Line className="h-3 w-3 md:h-5 md:w-5" />
                    )}
                  </Button>
                ) : null}
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
                {deletable ? (
                  <Button
                    size={"icon"}
                    variant="destructive"
                    className="absolute top-2 right-2 z-100 h-5 w-5 md:h-8 md:w-8 z-50"
                    onClick={() => {
                      handleDeleteAssets(i.id);
                    }}
                    disabled={deletingAssets.includes(i.id)}
                  >
                    {deletingAssets.includes(i.id) ? (
                      <Spinner className="ml-0" />
                    ) : (
                      <RiDeleteBin6Line className="h-3 w-3 md:h-5 md:w-5" />
                    )}
                  </Button>
                ) : null}
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
