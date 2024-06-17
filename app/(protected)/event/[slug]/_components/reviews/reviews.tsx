"use client";
import React, { useState } from "react";
import SubmitReviewTamplate from "./popup";
import { Button } from "@/components/ui/button";
import { getEventDetailsType, getReviewsType } from "@/actions/_utils/types.type";
import dayjs from "@/lib/dayjs";
import { timeZone } from "@/lib/common";
import Review from "@/components/review/review";

type BusinessData = {
  name: string;
  id: string;
};
type propsTypes = {
  reviews: getReviewsType["data"];
  businessData: BusinessData[];
  eventDetails: getEventDetailsType["data"]
};

function isEventPassedFunc(dateString: string, timezone: string) {
  const eventDate = dayjs.tz(dateString, timezone).startOf("day");
  const currentDate = dayjs.utc().tz(timezone);

  return eventDate.isBefore(currentDate);
}

const Reviews = (props: propsTypes) => {
  const { reviews, businessData, eventDetails } = props;
  const [sendReview, setSendReview] = useState(false);

  const handleToggleSendContract = () => {
    setSendReview(false);
  };

  const eventEndDate = eventDetails?.single_day_event ? eventDetails?.from_date: eventDetails?.to_date

  const isEventPassed = isEventPassedFunc(eventEndDate!, timeZone);

  return (
    <div>
      <SubmitReviewTamplate
        open={sendReview}
        onClose={handleToggleSendContract}
        businessesName={businessData}
      />

      <div className="flex items-center justify-between space-x-4">
        <h4 className="text-sm font-semibold">Reviews</h4>
        <div>
          <Button
            size="sm"
            className="p-4"
            onClick={() => {
              setSendReview(true);
            }}
            disabled={!isEventPassed}
          >
            Add Reviews
          </Button>
        </div>
      </div>
      {reviews.length > 0 ? (
        reviews.map(review => (
          <div key={review.id}>
            <Review reviewData={review!} />
          </div>
        ))
      ) : (
        <p className="text-center mt-4">No Reviews</p>
      )}
    </div>
  );
};

export default Reviews;
