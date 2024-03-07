"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { onBoarding } from "@/actions/(protected)/stripe/onboarding";
import { useRouter } from "next/navigation";
import { profileType } from "@/actions/_utils/types.type";

type propType = {
  user: profileType;
};
const ConnectToStripe = (props: propType) => {
  const navigate = useRouter();

  return (
    <div>
      <Dialog open={true}>
        <DialogContent
          className="max-w-[calc(100dvw-40px)] w-[425px]"
          closable={false}
        >
          <DialogHeader>
            <DialogTitle className="text-center mb-4">
              Need to Setup Your Stripe Connect Account
            </DialogTitle>
          </DialogHeader>
          <Button
            variant="secondary"
            onClick={async () => {
              const res = await onBoarding();
              if (res.success) {
                navigate.push(res.data);
              }
            }}
          >
            Setup on stripe!
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConnectToStripe;
