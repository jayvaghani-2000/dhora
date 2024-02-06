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

const formSchema = z.object({
  email: z.string().email({
    message: "Provide valid email.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      <section className="max-w-[100%] p-4 w-[400px] text-white">
        <p className="text-2xl md:text-4xl font-bold text-center mt-4 mb-12">
          Welcome back!
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className={InputClass}
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      className={InputClass}
                      placeholder="Insert Password"
                      type="  password"
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
            >
              Login
            </Button>
          </form>
        </Form>

        <div className="mt-16 mb-4 gap-1 flex justify-center">
          Don&apos;t have account?
          <Link href="/auth/register">{` Register`}</Link>
        </div>
      </section>
    </main>
  );
}
