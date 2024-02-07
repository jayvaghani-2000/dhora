import { RegisterUserSchema } from "@/app/api/models/authenticate/schema";
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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HTMLProps, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = RegisterUserSchema.extend({
  confirm_password: z.string().min(6, {
    message: "Password must match.",
  }),
}).refine(data => data.password === data.confirm_password, {
  message: "Passwords do not match.",
  path: ["confirm_password"],
});

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      confirm_password: "",
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      const registeredUser = await axios.post("/api/authenticate/register", {
        first_name: values.first_name,
        last_name: values.last_name,
        username: values.username,
        email: values.email,
        password: values.password,
      });

      if (registeredUser.data.success) {
        await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        router.push("/");
      }
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
      <section className="max-w-[100%] p-4 w-[600px] text-white">
        <p className="text-2xl md:text-4xl font-bold text-center mt-4 mb-12">
          Join us today!
        </p>
        <Form {...form}>
          {!!error && (
            <p className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300 text-center mb-4">
              {error}
            </p>
          )}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid md:grid-cols-2 gap-4"
          >
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input
                      className={InputClass}
                      placeholder="Insert First name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input
                      className={InputClass}
                      placeholder="Insert Last name"
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
                <FormItem className="md:col-span-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className={cn([InputClass])}
                      placeholder="Insert Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      className={InputClass}
                      placeholder="Insert Username"
                      {...field}
                    />
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
                    <Input
                      className={InputClass}
                      placeholder="Insert Password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      className={InputClass}
                      placeholder="Confirm Password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-sm my-2 font-semibold md:col-span-2">
              By signing up, you agree to our Terms & Privacy Policy
            </p>
            <Button
              className="w-full md:col-span-2 bg-white text-black hover:bg-white"
              type="submit"
              disabled={loading}
            >
              Get Started
            </Button>
          </form>
        </Form>

        <div className="mt-16 mb-4 gap-1 flex justify-center">
          Already have an account?
          <Link href="/auth/signin">{` Login`}</Link>
        </div>
      </section>
    </main>
  );
}
