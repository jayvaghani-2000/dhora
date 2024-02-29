import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Primary from "./primary";
import Secondary from "./secondary";
import { RiMenu5Fill } from "react-icons/ri";

export const MobileToggle = () => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden mr-2">
        <RiMenu5Fill />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
        <div className="w-[72px]">
          <Primary />
        </div>
        <Secondary />
      </SheetContent>
    </Sheet>
  );
};
