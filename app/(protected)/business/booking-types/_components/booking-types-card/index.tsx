import { getBookingTypesType } from "@/actions/_utils/types.type";
import { Button } from "@/components/ui/button";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import RichEditor from "@/components/shared/rich-editor";
import { FaRegClock } from "react-icons/fa";
import { deleteBookingType } from "@/actions/(protected)/business/booking-types/deleteBookingType";

type propType = {
  data: NonNullable<getBookingTypesType["data"]>[0];
};

const BookingTypeCard = (props: propType) => {
  const { data: bookingType } = props;
  const navigate = useRouter();
  const [loading, setLoading] = useState(false);
  const { title, duration, description, id } = bookingType!;
  const { toast } = useToast();

  const handleDeleteBookingType = async () => {
    setLoading(true);
    const res = await deleteBookingType(id as unknown as string);
    if (res && !res.success) {
      toast({ title: res.error });
    } else {
      toast({ title: "Booking type deleted successfully!" });
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-2 border border-gray1 first:rounded-t-md last:rounded-b-md p-2 lg:p-4 items-center">
      <div className="flex-1 flex flex-col gap-0.5">
        <div className="text-sm md:text-base font-semibold flex gap-1">
          {title}{" "}
        </div>
        <div className="flex flex-col  text-secondary-light-gray">
          <RichEditor value={description} readOnly />
        </div>
        <div className="flex items-center gap-1 md:text-xs text-white bg-primary-light-gray w-fit px-1 font-semibold py-0.5 rounded-sm">
          <FaRegClock className="h-3 w-3" />
          <span>{duration}m</span>
        </div>
      </div>
      <div className="flex gap-1">
        <Button
          variant="outline"
          className="p-1 h-[28px]"
          disabled={loading}
          onClick={() => {
            navigate.push(`/business/booking-types/${id}`);
          }}
        >
          <MdEdit size={18} color="#b6b6b6" />
        </Button>
        <Button
          variant="outline"
          className="p-1 h-[28px]"
          disabled={loading}
          onClick={() => {
            handleDeleteBookingType();
          }}
        >
          <RiDeleteBin6Line size={18} color="#b6b6b6" />
        </Button>
      </div>
    </div>
  );
};

export default BookingTypeCard;
