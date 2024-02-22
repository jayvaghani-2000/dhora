"use client";
import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitContract } from "@/actions/(protected)/(contracts)/submitContract";
import { submitContractResponseType } from "@/actions/_utils/types.type";
import { useRouter, useSearchParams } from "next/navigation";
import { PARAMS } from "./contractBuilder";
import { revalidate } from "@/actions/(public)/revalidate";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email." }),
});

type propType = {
  open: boolean;
  onClose: () => void;
};

const SendTemplate = (prop: propType) => {
  const { onClose, open } = prop;
  const navigate = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleCloseSendTemplate = () => {
    form.reset();
    onClose();
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const contractId = params.get(PARAMS.CONTRACT_ID);

    setLoading(true);
    const res: submitContractResponseType = await submitContract({
      templateId: contractId,
      email: values.email,
    });
    if (!res.success) {
      setError(res.error);
    } else {
      handleCloseSendTemplate();
      await revalidate("/business/contracts");
      navigate.replace("/business/contracts");
    }
    setLoading(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={value => {
        if (!value) {
          handleCloseSendTemplate();
        }
      }}
    >
      <DialogContent className="max-w-[calc(100dvw-40px)] w-[425px]">
        <DialogHeader>
          <DialogTitle>Send contract to recipient</DialogTitle>
          <DialogDescription>
            Please enter the recipient registered mail
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          {!!error && (
            <p className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300 text-center mb-4">
              {error}
            </p>
          )}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading}>
              Send contract
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SendTemplate;
