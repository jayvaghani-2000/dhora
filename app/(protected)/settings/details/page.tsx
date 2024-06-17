import React from "react";
import UpdatePassword from "./_components/update-password";
import PersonalDetails from "./_components/personal-detail";
import { me } from "@/actions/(auth)/me";
import ProfileAction from "./_components/profile-actions";

export default async function Details() {
  const user = await me();
  return user.success ? (
    <div>
      <PersonalDetails user={user.data} />
      <UpdatePassword />
      <ProfileAction />
    </div>
  ) : (
    <div className="text-center">Unable to fetch user details</div>
  );
}
