"use client";
import React, { useRef, useState } from "react";
import Placeholder from "./placeholder";
import { getContractType } from "@/actions/_utils/types.type";
import Link from "next/link";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa6";
import { FaChevronUp } from "react-icons/fa6";

type propsType = {
  template: getContractType;
};

const Templates = (props: propsType) => {
  const [expand, setExpand] = useState(false);
  const ref = useRef<HTMLDivElement>(null!);
  const { template } = props;

  return (
    <div>
      <Button
        onClick={() => {
          if (!expand) {
            ref.current.style.height = `${ref.current.scrollHeight}px`;
          } else {
            ref.current.style.removeProperty("height");
          }
          setExpand(prev => !prev);
        }}
        className="ml-auto flex items-center gap-1"
        variant="link"
      >
        {expand ? "Hide" : "View"}
        {expand ? <FaChevronUp /> : <FaChevronDown />}
      </Button>
      <div
        className={clsx({
          "grid gap-5 grid-cols-[repeat(auto-fill,minmax(160px,1fr))] transition-all duration-500 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] auto-rows-auto h-[120px] md:h-[140px] overflow-hidden":
            true,
        })}
        ref={ref}
      >
        <Placeholder />
        {template.success
          ? template.data.map(i => (
              <Link
                href={`/business/contracts/template?c_id=${i.template_id}`}
                key={i.id}
                className="px-2 bg-primary-black w-full h-[120px]  md:h-[140px] rounded-sm flex flex-col justify-center items-center border border-[#707070]"
              >
                <div className="text-white font-bold text-xs md:text-base text-center line-clamp-3	">
                  {i.name}
                </div>
              </Link>
            ))
          : null}
      </div>
    </div>
  );
};

export default Templates;
