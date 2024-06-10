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
import { submitContractResponseType } from "@/actions/_utils/types.type";
import { useRouter, useSearchParams } from "next/navigation";
import { revalidate } from "@/actions/(public)/revalidate";
import CustomDialog from "@/components/shared/custom-dialog";
import { PARAMS } from "../../contracts/template/_components/contractBuilder";
import { getContracts } from "@/actions/(protected)/business/contracts/getContracts";

const formSchema = z.object({
  contract: z.string().nonempty({ message: "Contract is required." }),
});

type propType = {
  open: boolean;
  onClose: () => void;
  customer_data: Record<string, string | number | Date | null | boolean>;
  event_data: Record<string, string | number | Date | null | boolean>;
};

type Contract = {
  id: string;
  name: string | null;
  business_id: string;
  created_at: Date;
  updated_at: Date;
  event_id: string | null;
  template_id: number;
};

const SendTemplate = (prop: propType) => {
  const { onClose, open, customer_data, event_data } = prop;
  const navigate = useRouter();
  // const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState<Contract[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getContracts();
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
      contract: "",
    },
  });

  const handleCloseSendTemplate = () => {
    form.reset();
    onClose();
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const selectedContract = contract.find(item => item.id === values.contract);
    if (!selectedContract) {
      setError("Invalid contract selected.");
      return;
    }

    setLoading(true);
    const res: submitContractResponseType = await submitContract({
      email: customer_data.email!.toString(),
      templateId: selectedContract.template_id!.toString(),
      event_id: event_data.id!.toString(),
    });
    if (!res.success) {
      setError(res.error);
    } else {
      handleCloseSendTemplate();
      await revalidate("/business/bookings");
      navigate.replace("/business/bookings");
    }
    setLoading(false);
  }

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
      <div className="text-base font-normal mb-2">
        Please select the contract
      </div>

      <Form {...form}>
        {!!error && (
          <p className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300 text-center mb-4">
            {error}
          </p>
        )}

        <FormField
          control={form.control}
          name="contract"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          <span className="text-muted-foreground ">
                            Select Contract
                          </span>
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {contract.map(items => (
                      <SelectItem key={items.id} value={items.id!}>
                        {items.name}
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
