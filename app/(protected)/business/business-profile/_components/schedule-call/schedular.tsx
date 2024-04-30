import { getAvailabilityDetail } from "@/actions/(protected)/business/availability/getAvailabilityDetail";
import { getBookingTypesType } from "@/actions/_utils/types.type";
import CustomDialog from "@/components/shared/custom-dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { scheduleCallSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDay } from "date-fns";
import { capitalize } from "lodash";
import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type propType = Partial<React.ComponentProps<typeof CustomDialog>> & {
  setOpen: Dispatch<SetStateAction<boolean>>;
  bookingTypes: getBookingTypesType["data"];
};

const Schedular = (props: propType) => {
  const { open = false, setOpen, bookingTypes } = props;

  const form = useForm<z.infer<typeof scheduleCallSchema>>({
    resolver: zodResolver(scheduleCallSchema),
    defaultValues: {},
    reValidateMode: "onChange",
  });

  const getAvailability = async (bookingId: string) => {
    const bookingType = bookingTypes!.find(
      i => (i.id as unknown as string) === bookingId
    );

    const res = await getAvailabilityDetail(
      bookingType!.availability_id as unknown as string
    );
  };

  return (
    <CustomDialog
      open={open}
      title="Schedule A Call"
      className="w-[1200px]"
      onClose={() => {
        setOpen(false);
      }}
      onSubmit={async () => {}}
    >
      <Form {...form}>
        <div className="flex-1 flex gap-2 flex-col w-full">
          <FormField
            control={form.control}
            name="booking_type_id"
            render={({ field }) => (
              <FormItem className="max-w-[300px]">
                <FormLabel>Booking type</FormLabel>
                <Select
                  onValueChange={e => {
                    field.onChange(e);
                    getAvailability(e);
                  }}
                  defaultValue={field.value!}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          <span className="text-muted-foreground ">
                            Select booking type
                          </span>
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bookingTypes!.map(i => (
                      <SelectItem key={i.id} value={i.id as unknown as string}>
                        {capitalize(i.title)} ({i.duration} mins)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <Calendar
            mode="single"
            disabled={date => {
              if (date < new Date()) {
                return true;
              } else {
                return getDay(date) === 1;
              }
            }}
            className="rounded-md border shadow"
          />
        </div>
      </Form>
    </CustomDialog>
  );
};

export default Schedular;
