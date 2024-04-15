"use client";
import { profileType } from "@/actions/_utils/types.type";
import { useState } from "react";
import ProfileAvatar from "./profile-avatar";
import { editProfileSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/spinner";
import { updateProfileDetail } from "@/actions/(protected)/profile/updateProfileDetail";
import { useToast } from "@/components/ui/use-toast";
import { revalidate } from "@/actions/(public)/revalidate";

type propType = {
  user: profileType;
};

const PersonalDetails = (props: propType) => {
  const { user } = props;
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof editProfileSchema>) {
    setLoading(true);
    const logo = new FormData();
    if (file) {
      logo.append("image", file);
    }
    const res = await updateProfileDetail({ profileDetail: values, logo });

    if (res.success) {
      toast({
        title: res.data,
      });
      await revalidate("/settings/details");
    } else {
      toast({
        title: res.error,
      });
    }
    setLoading(false);
  }

  return (
    <div className="mb-5">
      <div className="text-secondary-light-gray font-semibold text-base">
        Personal Details
      </div>
      <div className=" border rounded-md border-divider  p-4 mt-2 flex gap-6 flex-col items-center lg:flex-row">
        <ProfileAvatar file={file} setFile={setFile} user={user} />

        <div className="flex-1 w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="text-zinc-600 dark:text-zinc-200 relative w-full"
              autoComplete="off"
            >
              <div className="rounded-md  flex flex-col gap-5 xl:grid grid-cols-1">
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-x-4 gap-y-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            className="h-9 disabled:opacity-100"
                            placeholder="Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            className="h-9 disabled:opacity-100"
                            placeholder="Email"
                            disabled
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="col-span-2 flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      type="reset"
                      onClick={() => {
                        form.reset();
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      Save {loading && <Spinner type="inline" />}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
