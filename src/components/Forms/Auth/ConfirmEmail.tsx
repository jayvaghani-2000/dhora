import { Button } from "@/components/ui/button";
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
import { HTMLProps, useState } from "react";
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

export function ConfirmEmailForm() {
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
      await axios.post("/api/auth/confirm-email", values);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data.error);
      }
    } finally {
      setLoading(false);
    }
  }

  const InputClass: HTMLProps<HTMLElement>["className"] =
    "bg-black text-white border-none outline-none focus:outline-none focus:border-none";

  return (
    <main className="after:content-[''] after:absolute after:inset-0 after:bg-body-bg after:-z-10 relative min-h-screen min-w-screen flex justify-center items-center  bg-mix-gradient ">
      <section className="max-w-[100%] p-4 w-[400px] text-white">
        <p className="text-2xl md:text-4xl font-bold text-center mt-4 mb-12">
          Confirm your email!
        </p>
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
                  <FormLabel>Verification code</FormLabel>
                  <FormControl>
                    <Input
                      className={InputClass}
                      placeholder="Verification code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full md:col-span-2 bg-white text-black hover:bg-white"
              type="submit"
              disabled={loading}
            >
              Verify
            </Button>
          </form>
        </Form>
      </section>
    </main>
  );
}
