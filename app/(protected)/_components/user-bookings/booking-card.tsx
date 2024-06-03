import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { FaVideo } from "react-icons/fa6";
import dayjs from "@/lib/dayjs";
import { timeZone as Timezone } from "@/lib/common";
import RichEditor from "@/components/shared/rich-editor";
import { getBookingsType } from "@/actions/_utils/types.type";

interface Props {
  data: getBookingsType["data"]["pastBookings"][0];
}

const BookingCard = ({ data: { id, time, end, event } }: Props) => {
  const startTime = new Date(time!);
  const endTime = new Date(end!);

  const bookingDate = dayjs.utc(startTime).tz(Timezone).format("MMM D, YYYY");
  const start_time = dayjs.utc(startTime).tz(Timezone).format("h:mm A");
  const end_time = dayjs.utc(endTime).tz(Timezone).format("h:mm A");

  return (
    <Card className="flex flex-col items-start justify-between p-2 lg:p-4">
      <CardHeader className="p-0">
        <CardTitle className="text-base lg:text-lg">{bookingDate}</CardTitle>
        <CardDescription className="flex flex-col items-start gap-1 !mt-0">
          {start_time} - {end_time}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 mt-1">
        <p className="text-sm lg:text-base font-bold">{event?.title}</p>
        <RichEditor
          value={event?.description}
          readOnly
          className="text-gray-400"
        />
        <Link
          className="text-blue-500 flex items-center gap-1 hover:underline text-sm"
          href={`/room?roomId=${id}`}
        >
          <FaVideo /> Join Video
        </Link>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
