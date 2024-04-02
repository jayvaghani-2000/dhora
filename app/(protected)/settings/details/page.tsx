import React from "react";
import UpdatePassword from "./_components/update-password";
import PersonalDetails from "./_components/personal-detail";
import { Button } from "@/components/ui/button";
import { me } from "@/actions/(auth)/me";

const Details = async () => {
  const user = await me();
  return (
    <div>
      <PersonalDetails user={user.data} />
      <UpdatePassword />

      <div className="mt-5 flex gap-5">
        <Button className="bg-rose-700 text-destructive-foreground hover:bg-rose-700/90">
          Disable My Account
        </Button>
        <Button variant="destructive">Delete My Account</Button>
      </div>
    </div>
  );
};

export default Details;
