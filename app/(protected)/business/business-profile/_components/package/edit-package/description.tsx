import RichEditor from "@/components/shared/rich-editor";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { editPackageSchema } from "@/db/schema";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { CiCircleRemove } from "react-icons/ci";
import { z } from "zod";
import EditPackage from ".";

type propType = {
  form: UseFormReturn<z.infer<typeof editPackageSchema>>;
} & React.ComponentProps<typeof EditPackage>;

const Description = (prop: propType) => {
  const { form, packagesGroups } = prop;

  return (
    <Form {...form}>
      <div className="flex gap-2 flex-col mt-4">
        <FormField
          control={form.control}
          name="package_group_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group in</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value as string}
                >
                  <div className="flex gap-1 items-center">
                    <FormControl className="flex-1">
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            <span className="text-muted-foreground ">
                              Select Group
                            </span>
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <Button
                      type="button"
                      variant="destructive"
                      className="p-1 h-[32px] lg:h-[40px]  w-[32px] lg:w-[40px]"
                      onClick={() => {
                        field.onChange(null);
                      }}
                    >
                      <div className="h-6 w-6">
                        <CiCircleRemove className="h-full w-full" />
                      </div>
                    </Button>
                  </div>
                  <SelectContent>
                    {packagesGroups?.map(i => (
                      <SelectItem key={i.id} value={i.id}>
                        {i.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <RichEditor value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
};

export default Description;
