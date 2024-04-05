"use client";
import React, { useState } from "react";
import { profileType } from "@/actions/_utils/types.type";
import BusinessDetail from "./business-detail";
import { Button } from "@/components/ui/button";

type propType = {
  user: profileType;
  deletable?: boolean;
};

const BusinessDetailForm = (prop: propType) => {
  const { user } = prop;
  const [createNewBusiness, setCreateNewBusiness] = useState(false);

  return (
    <div>
      <div className="text-secondary-light-gray font-semibold text-base">
        Business Details
      </div>
      {createNewBusiness || user?.business ? (
        <BusinessDetail {...prop} />
      ) : (
        <div className="flex flex-col gap-4 mt-4 justify-center items-center">
          <div>Create your business now!</div>
          <Button
            onClick={() => {
              setCreateNewBusiness(true);
            }}
          >
            Create Business{" "}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BusinessDetailForm;
