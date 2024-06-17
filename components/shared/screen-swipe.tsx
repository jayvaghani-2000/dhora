import * as React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "../ui/scroll-area";
import { RxCross2 } from "react-icons/rx";

type propType = {
  title: string;
  children: React.ReactNode;
  trigger: React.ReactNode;
};

function ScreenSwipe(prop: propType) {
  const { children, title, trigger } = prop;

  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="h-screen">
        <DrawerFooter className="z-20 absolute right-4 top-4 lg:right-16  text-secondary-light-gray px-0">
          <DrawerClose asChild>
            <button>
              <RxCross2 className="h-6 lg:h-8 w-6 lg:w-8" />
            </button>
          </DrawerClose>
        </DrawerFooter>
        <ScrollArea>
          <div className="mx-auto w-full max-w-[800px]">
            <DrawerHeader className="sticky top-0 z-10">
              <DrawerTitle className="mix-blend-difference">
                {title}
              </DrawerTitle>
            </DrawerHeader>
            {children}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}

export default ScreenSwipe;
