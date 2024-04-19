import { getAvailability } from "@/actions/(protected)/business/availability/getAvailability";
import Availabilities from "./_components/availabilities";
import { getAvailabilityData } from "./_utils/initializeAvailability";

export default async function AvailabilitiesPage() {
  const data = await getAvailability({
    defaultAvailability: getAvailabilityData(),
  });

  return data.success ? (
    <Availabilities data={data.data} />
  ) : (
    <span className="text-center">{data.error}</span>
  );
}
