"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { onBoarding } from "@/actions/(protected)/stripe/onboarding";
import { useRouter } from "next/navigation";
import { profileType } from "@/actions/_utils/types.type";
import CustomDialog from "@/components/shared/custom-dialog";
import UploadLogo from "./upload-logo";
import { Input, InputProps } from "@/components/ui/input";
import PlacesAutocompleteInput from "@/components/shared/place-autocomplete";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { businessDetailSchema } from "../_utils/schema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { updateBusinessDetail } from "@/actions/(protected)/business/updateBusinessDetail";

type propType = {
  user: profileType;
} & InputProps;

const ConnectToStripe = (props: propType) => {
  const navigate = useRouter();
  const [open, setOpen] = useState(false);
  const { user } = props;
  const [file, setFile] = useState(user?.business?.logo ?? "");
  const [address, setAddress] = useState("");

  const form = useForm<z.infer<typeof businessDetailSchema>>({
    resolver: zodResolver(businessDetailSchema),
    defaultValues: {
      business_name: user?.business?.name ?? "",
      business_address: user?.business?.address ?? "",
      business_email: user?.email ?? "",
      business_contact: user?.business?.contact ?? "",
    },
    reValidateMode: "onChange",
  });

  const onSaveBusinessDetail = async (
    values: z.infer<typeof businessDetailSchema>
  ) => {
    await updateBusinessDetail({ businessDetail: values });
  };

  return (
    <>
      <CustomDialog
        title="Business Details"
        className="w-[720px]"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        onSubmit={async () => {
          await form.trigger();

          if (form.formState.isValid) {
            onSaveBusinessDetail(form.getValues());
          }
        }}
      >
        <div className="rounded-sm bg-secondary-black p-4 pb-6 md:pb-10 mb-5">
          <div className="m-auto flex max-w-[200px] md:max-w-[400px] items-center">
            <div className="relative flex flex-col gap-1 items-center">
              <span className="bg-white rounded-full h-8 w-8  text-black flex items-center justify-center">
                1
              </span>
              <span className="absolute whitespace-nowrap top-8 text-xs md:text-base">
                Enter Business Detail
              </span>
            </div>
            <div className={"flex-1  border-t border-divider"} />
            <div className="relative  flex flex-col gap-1 items-center">
              <span className="bg-white rounded-full h-8 w-8  text-black flex items-center justify-center">
                2
              </span>
              <span className="absolute whitespace-nowrap top-8 text-xs md:text-base">
                Payment Method
              </span>
            </div>
          </div>
        </div>

        <Form {...form}>
          <div className="text-zinc-600 dark:text-zinc-200 flex flex-col justify-center items-center gap-4 relative">
            <UploadLogo file={file} setFile={setFile} />

            <FormField
              control={form.control}
              name="business_contact"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      className="h-9 disabled:opacity-100"
                      placeholder="Business Contact"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <PlacesAutocompleteInput
              value={address}
              onChange={e => {
                setAddress(e);
              }}
              form={form}
            />
          </div>
        </Form>
      </CustomDialog>
      <div className="m-auto w-fit">
        <Button
          onClick={() => {
            setOpen(true);
          }}
        >
          Connect to Stripe
        </Button>
      </div>
    </>
  );
};

export default ConnectToStripe;
