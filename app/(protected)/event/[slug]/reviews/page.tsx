'use server'
import { getReviews } from "@/actions/(protected)/business/reviews/getReviews";
import Reviews from "../_components/reviews/reviews"
import { getEventBusiness } from "@/actions/(protected)/customer/events/getEventBusiness";

type propType = { params: { slug: string }; };

const ReviewPage = async (prop: propType) => {
  const response = await getReviews();
  const data = response.data;
  const eventBusinessData = await getEventBusiness({ event_id: prop.params.slug })
  return (
    <Reviews reviews={data!} businessData={eventBusinessData!}/>
  )
}

export default ReviewPage