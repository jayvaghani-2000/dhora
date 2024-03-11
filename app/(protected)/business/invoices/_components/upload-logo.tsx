"use client";

import { uploadBusinessLogo } from "@/actions/(protected)/business/uploadBusinessLogo";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/provider/store/authentication";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { LiaPlusSolid } from "react-icons/lia";

const allowFileType = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

type Props = {
  file: string;
  setFile: React.Dispatch<React.SetStateAction<string>>;
};

const UploadLogo = ({ file, setFile }: Props) => {
  const ref = useRef<HTMLInputElement>(null!);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const files = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = e.target.files;

      if (allowFileType.includes(files[0].type)) {
        setLoading(true);
        const imageForm = new FormData();
        imageForm.append("image", files[0]!);
        const res = await uploadBusinessLogo(imageForm);
        if (!res.success) {
          toast({
            title: "Unable to upload logo.",
          });
        } else {
          setFile(res.data.url);
        }
        setLoading(false);
      }
      ref.current.value = "";
    }
  };

  return (
    <div className="relative h-fit">
      <Button
        className="relative bg-white h-[120px]  md:h-[140px] rounded-sm flex flex-col justify-center items-center"
        style={{ aspectRatio: 1 }}
      >
        {file ? (
          <div className="h-full w-full ">
            <Image
              src={file}
              className="group object-contain"
              alt={file}
              fill
            />
          </div>
        ) : (
          <>
            <LiaPlusSolid size={60} className="text-black" />
            <div className="text-black font-bold text-xs md:text-base">
              Upload Photo
            </div>
          </>
        )}
        <input
          ref={ref}
          type="file"
          accept={allowFileType.toString()}
          onChange={files}
          disabled={loading}
          className="absolute z-10 inset-0 opacity-0 cursor-pointer"
        />
      </Button>
    </div>
  );
};

export default UploadLogo;
