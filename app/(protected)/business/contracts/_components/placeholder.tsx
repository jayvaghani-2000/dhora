import Link from "next/link";
import React from "react";
import { LiaPlusSolid } from "react-icons/lia";

const Placeholder = () => {
  return (
    <Link
      href="/business/contracts/template"
      className=" bg-white w-full h-[120px]  md:h-[140px] rounded-sm flex flex-col justify-center items-center"
    >
      <LiaPlusSolid size={60} className="text-black" />
      <div className="text-black font-bold text-xs md:text-base">
        Upload Document
      </div>
    </Link>
  );
};

export default Placeholder;
