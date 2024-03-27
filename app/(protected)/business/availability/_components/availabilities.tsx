"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PiPlus } from "react-icons/pi";
import CreateAvailability from "./create-availability";
import { getAvailabilityType } from "@/actions/_utils/types.type";
import AvailabilityCard from "./availability-card";

type propType = {
  data: getAvailabilityType["data"];
};

const Availabilities = (props: propType) => {
  const { data } = props;
  const [createAvailability, setCreateAvailability] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-end gap-4">
        <Button
          variant="secondary"
          className="text-xs lg:text-sm p-2 lg:px-4 h-fit"
        >
          My Availability
        </Button>
        <Button
          onClick={() => {
            setCreateAvailability(true);
          }}
          className="text-xs lg:text-sm p-2 h-fit lg:px-4 "
        >
          <PiPlus size={16} className="mr-2" />
          New
        </Button>
      </div>
      <div className="mt-4 flex flex-col">
        {data && data.length > 0 ? (
          data.map(i => (
            <AvailabilityCard data={i} key={i.id}></AvailabilityCard>
          ))
        ) : (
          <span className="text-center">Add your availability</span>
        )}
      </div>
      <CreateAvailability
        open={createAvailability}
        setOpen={setCreateAvailability}
      />
    </div>
  );
};

export default Availabilities;
