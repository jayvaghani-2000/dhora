"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { onBoarding } from "@/actions/(protected)/stripe/onboarding";
import { BsCreditCard2Front } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { profileType } from "@/actions/_utils/types.type";
import CustomDialog from "@/components/shared/custom-dialog";
import UploadLogo from "./upload-logo";
import { Input, InputProps } from "@/components/ui/input";
import PlacesAutocompleteInput from "@/components/shared/place-autocomplete";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { businessDetailSchema } from "@/lib/schema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { updateBusinessDetail } from "@/actions/(protected)/business/updateBusinessDetail";
import { useToast } from "@/components/ui/use-toast";
import clsx from "clsx";

type propType = {
  user: profileType;
} & InputProps;

const ConnectToStripe = (props: propType) => {
  const navigate = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [open, setOpen] = useState(true);
  const { user } = props;
  const { toast } = useToast();
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
    if (!file) {
      toast({
        title: "Please select business logo.",
      });
      return;
    }
    const res = await updateBusinessDetail({ businessDetail: values });
    if (res.success) {
      toast({
        title: "Business detail save successfully.",
      });
      setActiveStep(2);
    } else {
      toast({
        title: res.error,
      });
    }
  };

  const handleSubmitBusinessDetail = async () => {
    await form.trigger();

    if (form.formState.isValid) {
      onSaveBusinessDetail(form.getValues());
    }
  };

  const handleOnBoardBusiness = async () => {
    const res = await onBoarding();
    if (res.success) {
      navigate.push(res.data);
    } else {
      toast({
        title: res.error,
      });
    }
  };

  return (
    <CustomDialog
      title="Business Details"
      className="w-[720px]"
      open={open}
      onClose={() => {
        navigate.replace("/business/invoices");
        setOpen(false);
      }}
      saveText={activeStep === 1 ? "Save" : "Setup Payment Method"}
      onSubmit={
        activeStep === 1 ? handleSubmitBusinessDetail : handleOnBoardBusiness
      }
    >
      <div className="rounded-sm bg-secondary-black p-4 pb-6 md:pb-8 mb-5">
        <div className="m-auto flex max-w-[200px] md:max-w-[400px] items-center">
          <div
            className={clsx({
              "relative flex flex-col gap-1 items-center": true,
              "text-secondary-light-gray": activeStep !== 1,
              "text-white": activeStep === 1,
            })}
          >
            <span
              className={clsx({
                "rounded-full h-8 w-8  flex items-center justify-center": true,
                "bg-active text-secondary-light-gray": activeStep !== 1,
                "bg-white text-black ": activeStep === 1,
              })}
            >
              1
            </span>
            <span className="absolute whitespace-nowrap top-9 text-xs">
              Enter Business Detail
            </span>
          </div>
          <div className={"flex-1  border-t border-divider"} />
          <div
            className={clsx({
              "relative flex flex-col gap-1 items-center": true,
              "text-secondary-light-gray": activeStep !== 2,
              "text-white": activeStep === 2,
            })}
          >
            <span
              className={clsx({
                "rounded-full h-8 w-8  flex items-center justify-center": true,
                "bg-active text-secondary-light-gray": activeStep !== 2,
                "bg-white text-black ": activeStep === 2,
              })}
            >
              2
            </span>
            <span className="absolute whitespace-nowrap top-9 text-xs">
              Payment Method
            </span>
          </div>
        </div>
      </div>

      {activeStep === 1 ? (
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
              fieldName="business_address"
              form={form}
              defaultValue={user?.business?.address ?? ""}
              placeholder="Business Address"
            />
          </div>
        </Form>
      ) : null}
      {activeStep === 2 ? (
        <div className="w-fit m-auto">
          <BsCreditCard2Front size={250} />
        </div>
      ) : null}
    </CustomDialog>
  );
};

export default ConnectToStripe;
