"use client";
import { RegisterUserSchema } from "@/app/api/models/authenticate/schema";
import { assets } from "@/assets";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { businessTypeEnum } from "@/db/schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup } from "@radix-ui/react-radio-group";
import axios, { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HTMLProps, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = RegisterUserSchema.extend({
  confirm_password: z.string().min(6, {
    message: "Password must match.",
  }),
  is_bussiness_user: z.enum(["no", "yes"], {
    required_error: "You need to select a user type.",
  }),
  business_category: z.string().optional(),
  business_name: z.string().optional(),
  "t&c": z.string(),
}).refine(data => data.password === data.confirm_password, {
  message: "Passwords do not match.",
  path: ["confirm_password"],
});

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const businessTypeOptions = Object.values(businessTypeEnum)[1] as string[];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      confirm_password: "",
      username: "",
      email: "",
      password: "",
      is_bussiness_user: "no",
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
            className="grid md:grid-cols-2  gap-4"
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
                      placeholder=" First name"
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
                      placeholder=" Last name"
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
                      placeholder=" Email"
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
                      placeholder=" Username"
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
                      placeholder=" Password"
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

            <FormField
              control={form.control}
              name="is_bussiness_user"
              render={({ field: { onChange, value } }) => (
                <FormItem className="space-y-3 col-span-2">
                  <FormControl>
                    <RadioGroup
                      onChange={e => onChange(e)}
                      onValueChange={onChange}
                      defaultValue={value}
                      className="flex flex-row gap-3"
                    >
                      <FormItem
                        className="flex w-full items-center space-x-3 space-y-0 cursor-pointer"
                        onClick={() => onChange("no")}
                      >
                        <div className="bg-black w-full rounded-md p-2 flex gap-4">
                          <Image
                            src={assets.svg.AVATAR}
                            alt="avatar"
                            width={50}
                            height={35}
                          />
                          <div className="relative  w-full">
                            <input
                              type="radio"
                              value={"no"}
                              checked={value === "no"}
                              className="absolute right-0 accent-white "
                              onClick={() => onChange("no")}
                            />

                            <FormLabel className="font-normal">
                              Regular User
                            </FormLabel>
                            <FormDescription className="text-xs my-1">
                              For users that are not signing up as a business or
                              service provider
                            </FormDescription>
                          </div>
                        </div>
                      </FormItem>
                      <FormItem
                        onClick={() => onChange("yes")}
                        className="flex w-full items-center space-x-3 space-y-0 cursor-pointer"
                      >
                        <div className="bg-black w-full rounded-md p-2 flex gap-4">
                          <Image
                            src={assets.svg.AVATAR}
                            alt="avatar"
                            width={50}
                            height={35}
                          />
                          <div className="relative  w-full">
                            <input
                              type="radio"
                              value={"yes"}
                              checked={value === "yes"}
                              className="absolute right-0 accent-white"
                              onChange={() => onChange("yes")}
                            />
                            <FormLabel className="font-normal">
                              Business User
                            </FormLabel>
                            <FormDescription className="text-xs my-1">
                              For users that are signing up as a business or
                              service provider
                            </FormDescription>
                          </div>
                        </div>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.getValues("is_bussiness_user") === "yes" && (
              <>
                <FormField
                  control={form.control}
                  name="business_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input
                          className={InputClass}
                          placeholder="Business Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="business_category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                <span className="text-muted-foreground ">
                                  Select Category
                                </span>
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {businessTypeOptions.map(i => (
                            <SelectItem value={i}>{i}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <FormField
              control={form.control}
              name="t&c"
              render={({ field }) => (
                <FormItem className="w-full flex flex-row items-start col-span-2 space-x-3 space-y-0 rounded-md  py-4 ">
                  <FormControl>
                    <Checkbox
                      checked={field.value as any}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none w-full text-sm my-2 font-semibol">
                    <FormLabel>
                      By signing up, you agree to our Terms & Privacy Policy
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

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
