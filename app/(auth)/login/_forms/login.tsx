"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/db/schema";
import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { login } from "@/actions/(auth)/login";
import Spinner from "@/components/shared/spinner";
import { Password } from "@/components/shared/password";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    const data = await login(values);
    setLoading(false);
    if (!data?.success && data?.error) {
      setError(data.error);
    }
  }

  return (
    <>
      <p className="text-2xl md:text-4xl font-bold text-center mt-4 mb-12">
        Welcome back!
      </p>
      <Form {...form}>
        {!!error && (
          <p className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300 text-center mb-4">
            {error}
          </p>
        )}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Password placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full mt-2" type="submit" disabled={loading}>
            Login {loading ? <Spinner type="inline" /> : null}
          </Button>
        </form>
      </Form>

      <div className="mt-16 mb-4 gap-1 flex justify-center">
        Don&apos;t have account?
        <Link href="/register">{`Register`}</Link>
      </div>
    </>
  );
}
