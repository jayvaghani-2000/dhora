"use client";
import React, { useEffect, useRef, useState } from "react";
import Placeholder from "./placeholder";
import { getContractType } from "@/actions/_utils/types.type";
import Link from "next/link";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { useMobileScreen, useWindowSize } from "@/lib/hook/useScreenSize";
import { ChevronsUpDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type propsType = {
  template: getContractType;
};

const Templates = (props: propsType) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [templateInRows, setTemplateInRows] = useState(0);
  const { width } = useWindowSize();
  const isMobile = useMobileScreen();
  const wrapperRef = useRef<HTMLDivElement>(null!);
  const { template } = props;

  useEffect(() => {
    const innerWidth = wrapperRef.current.clientWidth;
    const itemWidth = isMobile ? 160 : 200;
    let numColumns = Math.floor(innerWidth / itemWidth);

    do {
      if ((numColumns - 1) * 20 + numColumns * itemWidth > innerWidth) {
        numColumns = numColumns - 1;
      }
    } while ((numColumns - 1) * 20 + numColumns * itemWidth > innerWidth);
    setTemplateInRows(numColumns);
  }, [width, isMobile]);

  return (
    <div ref={wrapperRef}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="flex items-center justify-between space-x-4 px-4">
          <h4 className="text-sm font-semibold">Contract templates</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div
          className={clsx({
            "grid gap-5 grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] auto-rows-auto h-[120px] md:h-[140px] overflow-hidden mt-2 mb-5":
              true,
          })}
        >
          <Placeholder />
          {template.success
            ? template.data.map(i => (
                <Link
                  href={`/business/contracts/template?c_id=${i.template_id}`}
                  key={i.id}
                  className="px-2 bg-primary-black w-full h-[120px] md:h-[140px] rounded-sm flex flex-col justify-center items-center border border-[#707070]"
                >
                  <div className="text-white font-bold text-xs md:text-base text-center line-clamp-3	">
                    {i.name}
                  </div>
                </Link>
              ))
            : null}
        </div>
        <CollapsibleContent>
          <div
            className={clsx({
              "mt-5 grid gap-5 grid-cols-[repeat(auto-fill,minmax(160px,1fr))] transition-all duration-500 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] auto-rows-auto overflow-hidden":
                true,
            })}
          >
            {template.success
              ? template.data.slice(templateInRows - 1).map(i => (
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
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default Templates;
