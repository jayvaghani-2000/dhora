"use client";

import {
  getAddOnsType,
  getBookingTypesType,
  getPackagesType,
  getSubEventsType,
  profileType,
} from "@/actions/_utils/types.type";
import { createCallSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  SelectItem,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capitalize } from "lodash";
import { Button } from "@/components/ui/button";
import { getSubEvents } from "@/actions/(protected)/customer/sub-events/getSubEvents";
import { useState } from "react";
import Schedular from "./schedular";

type propTypes = {
  user: profileType;
  packages: getPackagesType["data"];
  addOns: getAddOnsType["data"];
  bookingTypes: getBookingTypesType["data"];
};

const ScheduleCall = (props: propTypes) => {
  const [subEvents, setSubEvents] = useState([] as getSubEventsType["data"]);
  const [scheduleCall, setScheduleCall] = useState(false);
  const { user, addOns, packages, bookingTypes } = props;

  const events = user?.events || [];

  const form = useForm<z.infer<typeof createCallSchema>>({
    resolver: zodResolver(createCallSchema),
    defaultValues: {},
    reValidateMode: "onChange",
  });

  return (
    <div className="border-2 border-input rounded-md px-2 py-4">
      <Form {...form}>
        <div className="flex-1 flex gap-2 flex-col w-full">
          <FormField
            control={form.control}
            name="event_id"
            render={({ field }) => (
              <FormField
                control={form.control}
                name="sub_event_id"
                render={({ field: sub_event_field }) => (
                  <div className=" flex gap-2 flex-col">
                    <FormItem>
                      <Select
                        onValueChange={async value => {
                          field.onChange(value);
                          sub_event_field.onChange(null);
                          const res = await getSubEvents(value);
                          if (res.success) {
                            setSubEvents(res.data!);
                          }
                        }}
                        defaultValue={field.value!}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                <span className="text-muted-foreground ">
                                  Select event
                                </span>
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {events.map(i => (
                            <SelectItem
                              key={i.id}
                              value={i.id as unknown as string}
                            >
                              {capitalize(i.title)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                    <FormItem>
                      <Select
                        onValueChange={sub_event_field.onChange}
                        value={sub_event_field.value!}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                <span className="text-muted-foreground ">
                                  Select sub event
                                </span>
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subEvents!.map(i => (
                            <SelectItem
                              key={i.id}
                              value={i.id as unknown as string}
                            >
                              {capitalize(i.title)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  </div>
                )}
              />
            )}
          />

          <FormField
            control={form.control}
            name="package_id"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value!}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          <span className="text-muted-foreground ">
                            Select package
                          </span>
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {packages!.map(i => (
                      <SelectItem key={i.id} value={i.id as unknown as string}>
                        {capitalize(i.name!)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="add_on_id"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value!}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          <span className="text-muted-foreground ">
                            Select add on
                          </span>
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {addOns!.map(i => (
                      <SelectItem key={i.id} value={i.id as unknown as string}>
                        {capitalize(i.name!)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <Button
            variant="secondary"
            onClick={() => {
              setScheduleCall(true);
            }}
          >
            Schedule A Call
          </Button>
        </div>
      </Form>

      {scheduleCall ? (
        <Schedular
          open={scheduleCall}
          setOpen={setScheduleCall}
          bookingTypes={bookingTypes}
        />
      ) : null}
    </div>
  );
};

export default ScheduleCall;
