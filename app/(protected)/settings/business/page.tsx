import React from "react";
import BusinessDetail from "./_components/business-detail";
import { me } from "@/actions/(auth)/me";

export default async function BusinessDetailPage() {
  const user = await me();
  return <div>{user.success ? <BusinessDetail user={user.data} /> : null}</div>;
}
