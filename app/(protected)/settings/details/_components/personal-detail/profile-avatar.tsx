"use client";

import { profileType } from "@/actions/_utils/types.type";
import Spinner from "@/components/shared/spinner";
import { allowedImageType } from "@/lib/constant";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineModeEdit } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";

type Props = {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  user: profileType;
};

const ProfileAvatar = ({ file, setFile, user }: Props) => {
  const ref = useRef<HTMLInputElement>(null!);
  const [imageStr, setImageStr] = useState({
    base64: user?.image ?? "",
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
      <div
        className="relative h-[120px] border border-dashed border-divider  md:h-[140px] rounded-full flex flex-col justify-center items-center"
        style={{ aspectRatio: 1 }}
      >
        {imageStr.base64 ? (
          <div className="h-full w-full ">
            <Image
              src={imageStr.base64}
              className="group object-cover rounded-full "
              alt={imageStr.name}
              fill
            />
          </div>
        ) : (
          <RxAvatar className="h-[120px] w-[120px] md:h-[140px] md:w-[140px]" />
        )}
        <input
          ref={ref}
          type="file"
          accept={allowedImageType.toString()}
          onChange={files}
          disabled={loading}
          className="absolute z-10 inset-0 opacity-0 cursor-pointer"
        />

        <button
          className="cursor-pointer absolute  bottom-4 right-0 md:right-1.5 md:bottom-5 bg-white h-5 w-5 rounded-full flex justify-center items-center"
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

export default ProfileAvatar;
