import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Primary from "./primary";
import Secondary from "./secondary";
import { RiMenu5Fill } from "react-icons/ri";
import { profileType } from "@/actions/_utils/types.type";

type propType = {
  user: profileType;
};

export const MobileToggle = (props: propType) => {
  const { user } = props;
  return (
    <Sheet>
      <SheetTrigger className="md:hidden mr-2">
        <RiMenu5Fill />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
        <div className="w-[72px]">
          <Primary user={user} />
        </div>
        <Secondary user={user} />
      </SheetContent>
    </Sheet>
  );
};
