"use server";
import { getReviews } from "@/actions/(protected)/business/reviews/getReviews";
import Reviews from "../_components/reviews/reviews";
import { getEventBusiness } from "@/actions/(protected)/customer/events/getEventBusiness";

type propType = { params: { slug: string } };

const ReviewPage = async (prop: propType) => {
  const response = await getReviews(prop.params.slug as string);
  const data = response.data;
  let eventBusinessData = await getEventBusiness({
    event_id: prop.params.slug,
  });

  const businessIdsInReviews = new Set(data!.map(review => review.business_id));

  const filteredEventBusinessData = eventBusinessData!.filter(
    business => !businessIdsInReviews.has(business.id)
  );

  return <Reviews reviews={data!} businessData={filteredEventBusinessData!} />;
};

export default ReviewPage;
