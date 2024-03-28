import { getAvailabilityDetail } from "@/actions/(protected)/availability/getAvailabilityDetail";
import React from "react";
import AvailabilityForm from "../_components/availability-from";

type propType = {
  params: {
    availability_id: string;
  };
};

export default async function EditAvailabilitiesPage(props: propType) {
  const { params } = props;
  const { availability_id } = params;

  const data = await getAvailabilityDetail(availability_id);

  return data.success ? (
    <AvailabilityForm data={data.data} />
  ) : (
    <span className="text-center">{data.error}</span>
  );
}
