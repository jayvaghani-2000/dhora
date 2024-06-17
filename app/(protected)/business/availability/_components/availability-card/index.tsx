import { getAvailabilityType } from "@/actions/_utils/types.type";
import { Button } from "@/components/ui/button";
import { IoIosGlobe } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { deleteAvailability } from "@/actions/(protected)/business/availability/deleteAvailability";
import { availabilityAsString } from "../../_utils/initializeAvailability";
import { useToast } from "@/components/ui/use-toast";
import { graySubtitleFonts } from "@/lib/typography";

type propType = {
  data: NonNullable<getAvailabilityType["data"]>[0];
};

const AvailabilityCard = (props: propType) => {
  const { data: availability } = props;
  const navigate = useRouter();
  const [loading, setLoading] = useState(false);
  const { name, timezone, default: isDefault } = availability!;
  const { toast } = useToast();

  const handleDeleteAvailability = async () => {
    setLoading(true);
    const res = await deleteAvailability(availability.id);
    if (res && !res.success) {
      toast({ title: res.error });
    } else {
      toast({ title: "Availability deleted successfully!" });
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-2 border border-gray1 first:rounded-t-md last:rounded-b-md p-2 lg:p-4 items-center">
      <div className="flex-1 flex flex-col gap-0.5">
        <div className="text-sm md:text-base font-semibold flex gap-3">
          {name}{" "}
          {isDefault && (
            <Badge className="bg-green-800 hover:bg-green-900 text-white text-xs rounded-sm px-1">
              Default
            </Badge>
          )}
        </div>
        <div className="flex flex-col  text-secondary-light-gray">
          {availabilityAsString(availability, {
            locale: "en",
            hour12: true,
          }).map(i => (
            <span className={graySubtitleFonts} key={i}>
              {i}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 text-xs md:text-sm text-secondary-light-gray">
          <IoIosGlobe className="h-5 md:h-6 w-5 md:w-6" />
          <span>{timezone}</span>
        </div>
      </div>
      <div className="flex gap-1">
        <Button
          variant="outline"
          className="p-1 h-[28px]"
          disabled={loading}
          onClick={() => {
            navigate.push(`/business/availability/${availability.id}`);
          }}
        >
          <MdEdit size={18} color="#b6b6b6" />
        </Button>
        <Button
          variant="outline"
          className="p-1 h-[28px]"
          disabled={loading}
          onClick={() => {
            handleDeleteAvailability();
          }}
        >
          <RiDeleteBin6Line size={18} color="#b6b6b6" />
        </Button>
      </div>
    </div>
  );
};

export default AvailabilityCard;
