"use client";

import { profileType } from "@/actions/_utils/types.type";
import { allowedImageType } from "@/lib/constant";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { LiaPlusSolid } from "react-icons/lia";
import { MdOutlineModeEdit } from "react-icons/md";

type Props = {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  user: profileType;
};

const BusinessLogo = ({ file, setFile, user }: Props) => {
  const ref = useRef<HTMLInputElement>(null!);
  const [imageStr, setImageStr] = useState({
    base64: user?.business?.logo ?? "",
    name: "",
  });

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
      <div
        className="relative h-[120px] border border-dashed border-divider  md:h-[140px] rounded-sm flex flex-col justify-center items-center"
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
            <LiaPlusSolid size={60} />
            <div className="font-bold text-xs md:text-base">Upload Photo</div>
          </>
        )}
        <input
          ref={ref}
          type="file"
          accept={allowedImageType.toString()}
          onChange={files}
          className="absolute z-10 inset-0 opacity-0 cursor-pointer"
        />

        <button
          className="cursor-pointer absolute -right-1.5 -bottom-1.5 bg-white h-5 w-5 rounded-full flex justify-center items-center"
          onClick={e => {
            e.stopPropagation();
            ref.current.click();
          }}
        >
          <MdOutlineModeEdit color="#000" />
        </button>
      </div>
    </div>
  );
};

export default BusinessLogo;
