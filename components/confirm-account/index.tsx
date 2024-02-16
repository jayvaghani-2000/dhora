"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useAppDispatch } from "@/provider/store";
import { setAuthData, useAuthStore } from "@/provider/store/authentication";
import { resendVerificationCode } from "@/actions/(public)/(auth)/resend-verification-code";
import { verifyEmail } from "@/actions/(public)/(auth)/verify-email";
import { profileType } from "@/actions/(public)/(auth)/me";

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
    const result = await verifyEmail({
      verification_code: values.verification_code,
    });

    if (result?.success) {
      dispatch(
        setAuthData({
          profile: { ...result.data } as profileType,
        })
      );
    }
    setLoading(false);
  }

  async function handleResendEmail() {
    setLoading(true);
    await resendVerificationCode();
    setLoading(false);
  }

  return (
    <Dialog open={true}>
      <DialogContent
        className="max-w-[calc(100dvw-40px)] w-[425px]"
        closable={false}
      >
        <DialogHeader>
          <DialogTitle>Confirm your account</DialogTitle>
          <DialogDescription>
            Please enter the verification code received on your registered mail
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
                  <FormControl>
                    <Input
                      placeholder="Enter OTP"
                      autoComplete="off"
                      {...field}
                    />
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

        <div className="flex justify-end items-center">
          Didn&apos;t received any email?
          <Button
            className="px-1 py-0"
            variant="link"
            disabled={loading}
            onClick={handleResendEmail}
          >
            Resend
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
