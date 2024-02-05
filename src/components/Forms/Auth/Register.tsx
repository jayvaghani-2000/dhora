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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HTMLProps } from "react";
import { cn } from "@/lib/utils";

const formSchema = z
  .object({
    first_name: z.string().min(3, {
      message: "First name must be at least 3 characters.",
    }),
    last_name: z.string().min(3, {
      message: "Last name must be at least 3 characters.",
    }),
    email: z.string().email({
      message: "Provide valid email.",
    }),
    username: z.string().min(6, {
      message: "User name must be at least 6 characters.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirm_password: z.string().min(6, {
      message: "Password must match.",
    }),
  })
  .refine(data => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

export function RegisterForm() {
  const router = useRouter();
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
    // Perform client-side validation if needed

    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (result?.error) {
      // Handle login error
    } else {
      // Redirect to the desired page after successful login
      router.push("/");
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
