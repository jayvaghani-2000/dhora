"use client";

import { businessTypeEnum, registerSchema } from "@/db/schema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { RadioGroup } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PiUser, PiUsersThree } from "react-icons/pi";
import { register } from "@/actions/(public)/(auth)/register";
import { assets } from "@/components/assets";
import Image from "next/image";

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const businessTypeOptions = Object.values(businessTypeEnum)[1] as string[];

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      confirm_password: "",
      email: "",
      password: "",
      is_business: false,
      "t&c": false,
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setLoading(true);
    await register(values);
    setLoading(false);
  }

  return (
    <>
      <div className="flex flex-col text-center justify-center items-center mb-8">
        <a
          href="/"
          className="flex items-center text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <div
            className="mr-4"
            style={{ borderRadius: "5px", overflow: "hidden" }}
          >
            <Image src={assets.png.LOGO} alt="logo" width={72} height={72} />
          </div>
          <h1>Dhora</h1>
        </a>
      </div>
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
          className="flex flex-col md:grid md:grid-cols-2 gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
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
                  <Input placeholder="Password" type="password" {...field} />
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
            name="is_business"
            render={({ field: { onChange, value } }) => (
              <FormItem className="space-y-3 md:col-span-2  mt-4">
                <FormControl>
                  <RadioGroup className="flex flex-col md:flex-row gap-3">
                    <FormItem
                      className="flex w-full items-center space-x-3 space-y-0 cursor-pointer"
                      onClick={() => onChange(false)}
                    >
                      <Card className="p-4 w-full">
                        <div className="flex gap-4">
                          <PiUser size={50} />
                          <div className="relative w-full">
                            <input
                              type="radio"
                              checked={value == false}
                              onChange={() => {}}
                              className="absolute right-0 accent-black"
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
                      </Card>
                    </FormItem>
                    <FormItem
                      onClick={() => onChange(true)}
                      className="flex w-full items-center space-x-3 space-y-0 cursor-pointer"
                    >
                      <Card className="p-4 w-full">
                        <div className="flex gap-4">
                          <PiUsersThree size={50} />
                          <div className="relative w-full">
                            <input
                              type="radio"
                              checked={value == true}
                              onChange={() => {}}
                              className="absolute right-0 accent-black"
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
                      </Card>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.getValues("is_business") == true && (
            <>
              <FormField
                control={form.control}
                name="business_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Business Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="business_type"
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
                          <SelectItem key={i} value={i}>
                            {i}
                          </SelectItem>
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
                    checked={form.getValues()["t&c"]}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-1 sm:leading-none w-full text-sm my-2 font-semibold">
                  <FormLabel>
                    By signing up, you agree to our Terms & Privacy Policy
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <Button
            className="w-full md:col-span-2"
            type="submit"
            disabled={loading || !form.formState.isValid}
          >
            Get Started
          </Button>
        </form>
      </Form>

      <div className="mt-16 mb-4 gap-1 flex justify-center">
        Already have an account?
        <Link href="/login">{`Login`}</Link>
      </div>
    </>
  );
}
