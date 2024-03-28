import { getAvailability } from "@/actions/(protected)/availability/getAvailability";
import Availabilities from "./_components/availabilities";

export default async function AvailabilitiesPage() {
  const data = await getAvailability();

  return data.success ? (
    <Availabilities data={data.data} />
  ) : (
    <span className="text-center">{data.error}</span>
  );
}
