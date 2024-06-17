"use client";

import {
  getAddOnsType,
  getBookingTypesType,
  getPackagesType,
  profileType,
} from "@/actions/_utils/types.type";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Schedular from "./schedular";

type propTypes = {
  user: profileType;
  packages: getPackagesType["data"];
  addOns: getAddOnsType["data"];
  bookingTypes: getBookingTypesType["data"];
};

const ScheduleCall = (props: propTypes) => {
  const [scheduleCall, setScheduleCall] = useState(false);

  return (
    <>
      <div className="md:p-2 md:px-6 bg-gradient md-bg-gradient-hidden md:bg-white fixed bottom-0 left-0 md:left-[320px] right-0 md:flex md:justify-end z-50">
        <Button
          className="w-full md:w-fit bg-transparent hover:bg-transparent bg-gradient hover:bg-gradient text-white uppercase text-lg md:text-base font-semibold"
          onClick={() => {
            setScheduleCall(true);
          }}
        >
          Schedule a Call
        </Button>
      </div>

      {scheduleCall ? (
        <Schedular open={scheduleCall} setOpen={setScheduleCall} {...props} />
      ) : null}
    </>
  );
};

export default ScheduleCall;
