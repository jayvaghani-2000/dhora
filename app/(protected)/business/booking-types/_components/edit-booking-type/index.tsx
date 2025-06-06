"use client";
import {
  getAvailabilityType,
  getBookingTypeDetailType,
} from "@/actions/_utils/types.type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Event from "./event";
import Availability from "./availability";
import { editBookingTypeSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/shared/spinner";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useParams } from "next/navigation";
import { deleteBookingType } from "@/actions/(protected)/business/booking-types/deleteBookingType";
import { updateBookingType } from "@/actions/(protected)/business/booking-types/updateBookingType";
import BackButton from "@/components/shared/back-button";

type propType = {
  bookingType: getBookingTypeDetailType["data"];
  availability: getAvailabilityType["data"];
};

const EditBookingType = (props: propType) => {
  const { bookingType } = props;

  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const params = useParams();

  const form = useForm<z.infer<typeof editBookingTypeSchema>>({
    resolver: zodResolver(editBookingTypeSchema),
    defaultValues: {
      title: bookingType?.title,
      description: bookingType?.description,
      duration: bookingType?.duration,
      availability_id: bookingType?.availability_id,
      booking_frequency: bookingType?.booking_frequency as z.infer<
        typeof editBookingTypeSchema
      >["booking_frequency"],
    },
  });

  const handleDeleteBookingType = async () => {
    setDeleting(true);
    const res = await deleteBookingType(params.booking_type_id as string);
    if (res && !res.success) {
      toast({ title: res.error });
    } else {
      toast({ title: "Booking type deleted successfully!" });
    }
    setDeleting(false);
  };

  const handleUpdateBookingType = async () => {
    await form.trigger();
    if (form.formState.isValid) {
      setLoading(true);
      const res = await updateBookingType({
        bookingTypeId: params.booking_type_id as string,
        values: form.getValues(),
      });

      if (res && !res.success) {
        toast({ title: res.error });
      } else {
        toast({ title: "Booking type updated successfully!" });
      }

      setLoading(false);
    } else {
      const error = form.formState.errors;

      const errorMsg = Object.values(error);
      const errorMsgKey = Object.keys(error);
      if (errorMsg[0]) {
        toast({
          title:
            errorMsg[0].message ??
            `Error in ${errorMsgKey[0].replace(/_/g, " ")}`,
        });
      }
    }
  };

  return (
    <Tabs defaultValue="event">
      <BackButton to="/business/booking-types" />
      <div className="flex justify-between gap-5 mt-2">
        <TabsList className="overflow-auto flex items-start justify-start max-w-full w-fit scrollbar-hide ">
          <TabsTrigger value="event">Event setup</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            className="p-1 h-[28px]"
            disabled={loading || deleting}
            onClick={() => {
              handleDeleteBookingType();
            }}
          >
            <RiDeleteBin6Line size={18} color="#b6b6b6" />
          </Button>
          <Separator orientation="vertical" className="w-0.5 h-8" />
          <Button
            onClick={handleUpdateBookingType}
            disabled={loading || deleting}
            className="h-fit lg:h-auto"
          >
            Save {loading && <Spinner type="inline" />}
          </Button>
        </div>
      </div>
      <TabsContent value="event">
        <Event form={form} />
      </TabsContent>
      <TabsContent value="availability">
        <Availability {...props} form={form} />
      </TabsContent>
    </Tabs>
  );
};

export default EditBookingType;
