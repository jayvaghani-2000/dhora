"use client";

import { uploadBusinessAssets } from "@/actions/(protected)/business/profile/assets/uploadBusinessAssets";
import { uploadBusinessAssetsType } from "@/actions/_utils/types.type";
import Spinner from "@/components/shared/spinner";
import { useToast } from "@/components/ui/use-toast";
import { extractVideoMetadata } from "@/lib/common";
import { allowedImageType, allowedVideoType } from "@/lib/constant";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { LiaPlusSolid } from "react-icons/lia";

const UploadAssets = () => {
  const ref = useRef<HTMLInputElement>(null!);
  const [assetsStr, setAssetsStr] = useState({
    base64: "",
    name: "",
    type: "",
  });
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const files = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = e.target.files;

      if ([...allowedImageType, ...allowedVideoType].includes(files[0].type)) {
        let res = {} as uploadBusinessAssetsType;
        setFile(files[0]);
        setLoading(true);
        const assetsForm = new FormData();
        if (allowedImageType.includes(files[0].type)) {
          assetsForm.append("image", files[0]!);
          res = await uploadBusinessAssets({ file: assetsForm });
        } else {
          assetsForm.append("video", files[0]!);
          const metadata = await extractVideoMetadata(files[0]);
          res = await uploadBusinessAssets({ file: assetsForm, metadata });
        }
        if (!res.success) {
          toast({
            title: "Unable to upload asset.",
          });
        } else {
          toast({
            title: "Asset uploaded successfully.",
          });
        }
        setLoading(false);
      }
      ref.current.value = "";
    }
  };

  useEffect(() => {
    if (file) {
      const { name, type } = file;
      const reader = new FileReader();

      reader.onloadend = function () {
        const result = reader.result as string;
        const base64String = result;
        setAssetsStr({ base64: base64String, name, type });
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  return (
    <div className="relative h-fit">
      {loading ? <Spinner /> : null}
      <div
        className="relative h-[120px] border border-dashed border-divider  md:h-[140px] rounded-sm flex flex-col justify-center items-center"
        style={{ aspectRatio: 1 }}
      >
        {assetsStr.base64 ? (
          <div className="h-full w-full flex justify-center items-center ">
            {allowedVideoType.includes(assetsStr.type) ? (
              <video
                src={assetsStr.base64}
                className="object-cover rounded-sm h-full w-full"
                controls
                autoPlay
                onPlay={e => e.stopPropagation()}
                onPause={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
              />
            ) : (
              <Image
                src={assetsStr.base64}
                className="group object-cover rounded-sm "
                alt={assetsStr.name}
                fill
              />
            )}
          </div>
        ) : (
          <>
            <LiaPlusSolid size={60} />
            <div className="font-bold text-xs md:text-base">Upload Assets</div>
          </>
        )}
        <input
          ref={ref}
          type="file"
          accept={[...allowedImageType, ...allowedVideoType].toString()}
          onChange={files}
          className="absolute z-10 inset-0 opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default UploadAssets;
