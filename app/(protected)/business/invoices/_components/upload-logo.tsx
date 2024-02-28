"use client";

import { uploadBusinessLogo } from "@/actions/(protected)/invoices/uploadBusinessLogo";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { LiaPlusSolid } from "react-icons/lia";

const allowFileType = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

type propType = {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
};

const UploadLogo = (prop: propType) => {
  const { file, setFile } = prop;
  const ref = useRef<HTMLInputElement>(null!);
  const [imageStr, setImageStr] = useState({
    base64: "",
    name: "",
  });

  const files = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = e.target.files;

      if (allowFileType.includes(files[0].type)) {
        setFile(files[0]);
      }
      const form = new FormData();

      form.append("image", e.target.files[0]);

      await uploadBusinessLogo(form);
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
      <Button className="relative bg-white w-full h-[120px]  md:h-[140px] rounded-sm flex flex-col justify-center items-center">
        {imageStr.base64 ? (
          <div className="h-full w-full ">
            <Image
              src={imageStr.base64}
              className="group object-contain"
              alt={imageStr.name}
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
      </Button>
      <input
        ref={ref}
        type="file"
        accept={allowFileType.toString()}
        onChange={files}
        className="absolute z-10 inset-0 opacity-0 cursor-pointer"
      />
    </div>
  );
};

export default UploadLogo;
