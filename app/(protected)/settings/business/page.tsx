import React from "react";
import { me } from "@/actions/(auth)/me";
import BusinessDetailForm from "../../_components/business-detail-form";

export default async function BusinessDetailPage() {
  const user = await me();
  return (
    <div>{user.success ? <BusinessDetailForm user={user.data} /> : null}</div>
  );
}
