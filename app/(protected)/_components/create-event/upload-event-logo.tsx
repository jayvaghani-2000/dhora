"use client";

import Spinner from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { allowedImageType } from "@/lib/constant";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { LiaPlusSolid } from "react-icons/lia";

type Props = {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
};

const UploadEventLogo = ({ file, setFile }: Props) => {
  const ref = useRef<HTMLInputElement>(null!);
  const [imageStr, setImageStr] = useState({
    base64: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);

  const files = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = e.target.files;

      if (allowedImageType.includes(files[0].type)) {
        setFile(files[0]);
      }
      ref.current.value = "";
    }
  };

  useEffect(() => {
    if (file) {
      const { name } = file;
      const reader = new FileReader();

      reader.onloadend = function () {
        const result = reader.result as string;
        const base64String = result;
        setImageStr({ base64: base64String, name });
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  return (
    <div className="relative h-fit">
      {loading ? <Spinner /> : null}
      <Button
        className="relative bg-white h-[120px] w-[120px] md:w-[140px]  md:h-[140px] rounded-sm flex flex-col justify-center items-center "
        style={{ aspectRatio: 1 }}
      >
        {imageStr.base64 ? (
          <div className="h-full w-full ">
            <Image
              src={imageStr.base64}
              className="group object-cover rounded-sm "
              alt={imageStr.name}
              fill
            />
          </div>
        ) : (
          <>
            <LiaPlusSolid size={60} className="text-black" />
            <div className="text-black font-bold text-xs md:text-base text-wrap	">
              Upload Event Logo
            </div>
          </>
        )}
        <input
          ref={ref}
          type="file"
          accept={allowedImageType.toString()}
          onChange={files}
          disabled={loading}
          className="absolute z-10 inset-0 opacity-0 cursor-pointer"
        />
      </Button>
    </div>
  );
};

export default UploadEventLogo;
