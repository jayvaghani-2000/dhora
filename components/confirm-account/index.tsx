"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/provider/store";
import { setAuthData } from "@/provider/store/authentication";
import { resendVerificationCode } from "@/actions/(auth)/resend-verification-code";
import { verifyEmail } from "@/actions/(auth)/verify-email";
import { profileType } from "@/actions/_utils/types.type";
import CustomDialog from "../shared/custom-dialog";

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
      const profile = { ...result.data } as profileType;
      dispatch(
        setAuthData({
          profile: profile,
          isBusinessUser: !!profile?.business_id,
        })
      );
    } else {
      setError(result.error as string);
    }
    setLoading(false);
  }

  async function handleResendEmail() {
    setLoading(true);
    await resendVerificationCode();
    setLoading(false);
  }

  return (
    <CustomDialog
      open={true}
      closable={false}
      title="Verify OTP"
      saveText="Verify"
      className="w-[480px]"
      onSubmit={async () => {
        await form.trigger();
        if (form.formState.isValid) {
          await onSubmit(form.getValues());
        }
      }}
    >
      <Form {...form}>
        {!!error && (
          <p className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300 text-center mb-4">
            {error}
          </p>
        )}
        <div className="text-center">
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
          <div className="flex justify-end items-center mt-0">
            <Button
              className="px-1 py-0"
              variant="link"
              type="button"
              disabled={loading}
              onClick={handleResendEmail}
            >
              Resend OTP
            </Button>
          </div>
        </div>
      </Form>
    </CustomDialog>
  );
}
