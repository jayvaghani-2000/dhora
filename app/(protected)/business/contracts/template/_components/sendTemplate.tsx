"use client";
import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitContract } from "@/actions/(protected)/business/contracts/submitContract";
import {
  getEmailAndEventType,
  submitContractResponseType,
} from "@/actions/_utils/types.type";
import { useRouter, useSearchParams } from "next/navigation";
import { PARAMS } from "./contractBuilder";
import { revalidate } from "@/actions/(public)/revalidate";
import CustomDialog from "@/components/shared/custom-dialog";
import { getEmailAndEvent } from "@/actions/(protected)/business/contracts/getEmailAndEvent";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email." }),
  eventId: z.string().optional(),
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
  const [contract, setContract] = useState<getEmailAndEventType["data"]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEmailAndEvent();
        const data = response.data;
        setContract(data!);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      eventId: "",
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
      templateId: contractId!,
      email: values.email,
      event_id: values.eventId!.toString(),
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

  const handleSelectChange = (value: string) => {
    const selectedEvent = contract!.find(item => item.id === value);
    if (selectedEvent) {
      form.setValue("email", selectedEvent.customer.email);
    }
    form.setValue("eventId", value);
  };

  return (
    <CustomDialog
      title="Send Contract"
      className="w-[425px]"
      open={open}
      saveText="Send"
      onClose={handleCloseSendTemplate}
      onSubmit={async () => {
        await form.trigger();

        if (form.formState.isValid) {
          await onSubmit(form.getValues());
        }
      }}
    >
      <Form {...form}>
        {!!error && (
          <p className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300 text-center mb-4">
            {error}
          </p>
        )}

        <div className="text-base font-normal mb-2">Email:</div>
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
        <br />
        <div className="text-base font-normal mb-2">
          Please select the event
        </div>
        <FormField
          control={form.control}
          name="eventId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={value => {
                    field.onChange(value);
                    handleSelectChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        <span className="text-muted-foreground">
                          Select Event
                        </span>
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {contract!.map(items => (
                      <SelectItem key={items.id} value={items.id}>
                        {items.customer.email}({items.event?.title})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </CustomDialog>
  );
};

export default SendTemplate;
