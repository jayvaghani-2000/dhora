"use client";

import { uploadBusinessLogo } from "@/actions/(protected)/invoices/uploadBusinessLogo";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useRef } from "react";
import { LiaPlusSolid } from "react-icons/lia";

const allowFileType = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

type Props = {
  file: string;
  setFile: React.Dispatch<React.SetStateAction<string>>;
};

const UploadLogo = ({ file, setFile }: Props) => {
  const ref = useRef<HTMLInputElement>(null!);

  const files = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = e.target.files;

      if (allowFileType.includes(files[0].type)) {
        const imageForm = new FormData();
        imageForm.append("image", files[0]!);
        const res = await uploadBusinessLogo(imageForm);
        setFile(res.data?.url as string);
      }
      ref.current.value = "";
    }
  };

  return (
    <form className="relative h-fit">
      <Button className="relative bg-white w-full h-[120px]  md:h-[140px] rounded-sm flex flex-col justify-center items-center">
        {file ? (
          <div className="h-full w-full ">
            <Image
              src={file}
              className="group object-contain"
              alt={"logo"}
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
    </form>
  );
};

export default UploadLogo;
