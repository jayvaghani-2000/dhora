import CustomDialog from "@/components/shared/custom-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getTimeSlotsFromDate,
  initializeAvailability,
} from "../_utils/initializeAvailability";
import { parseTimezone, timeZone } from "@/lib/common";
import { createAvailability } from "@/actions/(protected)/business/availability/createAvailability";
import { revalidate } from "@/actions/(public)/revalidate";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z
    .string()
    .refine(data => data.trim().length > 0, { message: "Name is required" }),
});

type propType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateAvailability = (props: propType) => {
  const { open, setOpen } = props;
  const navigate = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  const handleSubmit = async (value: z.infer<typeof formSchema>) => {
    setLoading(true);
    const data = initializeAvailability();
    const userTimeZone = parseTimezone(timeZone);

    const res = await createAvailability({
      ...value,
      days: data.days,
      timezone: userTimeZone,
      availability: getTimeSlotsFromDate(data.timeSlots),
    });
    if (res.success) {
      await revalidate("/business/availability");
      navigate.push(`/business/availability/${res.data.id}`);
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  return (
    <CustomDialog
      open={open}
      title="Add a New Schedule"
      className="w-[600px]"
      onClose={handleClose}
      onSubmit={async () => {
        await form.trigger();
        if (form.formState.isValid) {
          await handleSubmit(form.getValues());
        }
      }}
      disableAction={loading}
    >
      <Form {...form}>
        {!!error && (
          <p className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300 text-center mb-4">
            {error}
          </p>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Name" autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </CustomDialog>
  );
};

export default CreateAvailability;
