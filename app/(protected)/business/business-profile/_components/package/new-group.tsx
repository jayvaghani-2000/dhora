import CustomDialog from "@/components/shared/custom-dialog";
import { createPackageGroupSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createPackageGroup } from "@/actions/(protected)/business/packages/createPackageGroup";

const NewPackageGroup = (
  props: Partial<React.ComponentProps<typeof CustomDialog>> & {
    setOpen: Dispatch<SetStateAction<boolean>>;
  }
) => {
  const { open = false, setOpen } = props;
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof createPackageGroupSchema>>({
    resolver: zodResolver(createPackageGroupSchema),
    defaultValues: {
      name: "",
    },
    reValidateMode: "onChange",
  });

  const handleCloseCreateEvent = () => {
    setOpen(false);
    form.reset();
  };

  const handleSubmit = async (
    value: z.infer<typeof createPackageGroupSchema>
  ) => {
    setLoading(true);
    const res = await createPackageGroup(value);
    if (res && !res.success) {
      toast({
        title: res.error,
      });
    } else {
      toast({
        title: "Package group create successfully",
      });
      handleCloseCreateEvent();
    }
    setLoading(false);
  };

  return (
    <CustomDialog
      open={open}
      title="Create Group"
      className="w-[400px]"
      saveText="Create"
      onClose={handleCloseCreateEvent}
      onSubmit={async () => {
        await form.trigger();
        if (form.formState.isValid) {
          await handleSubmit(form.getValues());
        }
      }}
      disableAction={loading}
    >
      <div className="flex gap-5 flex-col md:flex-row items-center md:items-start">
        <Form {...form}>
          <div className="flex-1 flex gap-2 flex-col w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </div>
    </CustomDialog>
  );
};

export default NewPackageGroup;
