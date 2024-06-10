"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import CustomDialog from "@/components/shared/custom-dialog";
import { CiStar } from "react-icons/ci";
import { Input } from "@/components/ui/input";
import RichEditor from "@/components/shared/rich-editor";
import Rating from "react-rating";
import { FaStar } from "react-icons/fa6";
import { createReviews } from "@/actions/(protected)/business/reviews/createReviews";
import { revalidate } from "@/actions/(public)/revalidate";

const formSchema = z.object({
  business: z.string().nonempty({ message: "Business is required." }),
  rating: z.number().min(1, { message: "Rating is required." }),
  title: z.string().nonempty({ message: "Title is required." }),
  feedback: z.string().nonempty({ message: "Feedback is required." }),
});

type BusinessData = {
  name: string;
  id: string;
};

type propType = {
  open: boolean;
  onClose: () => void;
  businessesName: BusinessData[];
};

const SubmitReviewTamplate = (prop: propType) => {
  const { onClose, open, businessesName } = prop;
  const navigate = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      business: "",
      rating: 0,
      title: "",
      feedback: "",
    },
  });

  const handleCloseSendTemplate = () => {
    form.reset();
    onClose();
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const res: any = await createReviews({ ...values, event_id: params.slug });
    if (!res.success) {
      setError(res.error);
    } else {
      handleCloseSendTemplate();
      await revalidate(`/event/${params.slug}/reviews`);
      navigate.replace(`/event/${params.slug}/reviews`);
    }
    setLoading(false);
    handleCloseSendTemplate();
  }

  return (
    <CustomDialog
      title="ADD REVIEWS"
      className="w-[425px] "
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
        <FormField
          control={form.control}
          name="business"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Business</FormLabel>
              <FormControl>
                <Select
                  onValueChange={value => {
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        <span className="text-muted-foreground">
                          Select Business
                        </span>
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {businessesName.length > 0 ? (
                      businessesName?.map(items => (
                        <SelectItem key={items.name} value={items.id}>
                          {items.name}
                        </SelectItem>
                      ))
                    ) : (
                      <p className="px-2 text-sm">No Businesses</p>
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem className="mt-3 flex flex-col justify-center text-3xl">
              <FormLabel>Your Ratings</FormLabel>
              <FormControl>
                <Rating
                  emptySymbol={<CiStar />}
                  fullSymbol={<FaStar />}
                  fractions={2}
                  onChange={rate => field.onChange(rate)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Feedback</FormLabel>
              <FormControl>
                <RichEditor value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </CustomDialog>
  );
};

export default SubmitReviewTamplate;
