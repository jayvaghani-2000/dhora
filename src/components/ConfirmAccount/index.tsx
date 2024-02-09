"use client";

import { useAppDispatch } from "@/app/store";
import { setAuthData, useAuthStore } from "@/app/store/authentication";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  verification_code: z
    .string()
    .min(6, {
      message: "Code must be of 6 characters.",
    })
    .max(6, {
      message: "Code must be of 6 characters.",
    }),
});

export function ConfirmAccount() {
  const { profile } = useAuthStore();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      verification_code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await axios.post("/api/authenticate/confirm-email", values);
      dispatch(
        setAuthData({
          profile: { ...profile!, verified: true },
        })
      );
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data.error);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResendEmail() {
    setLoading(true);
    try {
      await axios.post("/api/authenticate/resend-email", {});
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data.error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px]" closable={false}>
        <DialogHeader>
          <DialogTitle>Confirm your account</DialogTitle>
          <DialogDescription>
            We just mailed you an code to your registered email, please verify
            it.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          {!!error && (
            <p className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300 text-center mb-4">
              {error}
            </p>
          )}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="verification_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="code" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading}>
              Verify
            </Button>
          </form>
        </Form>

        <div className="flex justify-center items-center">
          Didn&apos;t received any email?
          <Button
            variant="link"
            disabled={loading}
            onClick={handleResendEmail}
          >{` Resend`}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
