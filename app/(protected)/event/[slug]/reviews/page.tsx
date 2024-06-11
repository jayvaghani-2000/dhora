"use server";
import { getReviews } from "@/actions/(protected)/business/reviews/getReviews";
import Reviews from "../_components/reviews/reviews";
import { getEventBusiness } from "@/actions/(protected)/customer/events/getEventBusiness";
import { getEventDetails } from "@/actions/(protected)/customer/events/getEventDetails";

type propType = { params: { slug: string } };

const ReviewPage = async (prop: propType) => {
  const [response, eventBusinessData, eventDetails] = await Promise.all([
    await getReviews(prop.params.slug),
    await getEventBusiness({ event_id: prop.params.slug }),
    await getEventDetails(prop.params.slug),
  ]);
  const data = response.data;
  const businessIdsInReviews = new Set(data.map(review => review.business_id));

  const filteredEventBusinessData = eventBusinessData.data!.filter(
    business => !businessIdsInReviews.has(business.id)
  );

  if(!eventDetails.success) {
    return <div className="text-center">Unable to fetch event details</div>;
  }

  return <Reviews reviews={data} businessData={filteredEventBusinessData} eventDetails={eventDetails.data} />;
};

export default ReviewPage;
