"use client";
import React, { useState } from "react";
import { updatePasswordSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updatePassword } from "@/actions/(auth)/update-password";
import Spinner from "@/components/shared/spinner";
import { useToast } from "@/components/ui/use-toast";

const UpdatePasswordFrom = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      old_password: "",
      confirm_new_password: "",
      new_password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof updatePasswordSchema>) {
    setLoading(true);
    const res = await updatePassword(values);
    if (res.success) {
      form.reset();
      toast({ title: res.data });
    } else {
      toast({ title: res.error });
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="text-secondary-light-gray font-semibold text-base">
        Update Password
      </div>
      <div className=" border rounded-md border-divider  p-4 mt-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col max-w-[300px] gap-2"
          >
            <FormField
              control={form.control}
              name="old_password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Old Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="New Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_new_password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Confirm Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              Update {loading ? <Spinner type="inline" /> : null}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdatePasswordFrom;
