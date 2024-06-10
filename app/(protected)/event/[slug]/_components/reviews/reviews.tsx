"use client";
import React, { useEffect, useState } from "react";
import SubmitReviewTamplate from "./popup";
import Review from "./review";
import { Button } from "@/components/ui/button";

type ReviewType = {
  id: string;
  description: string | null;
  title: string | null;
  rating: number;
  business_id: string | null;
  customer_id: string | null;
  event_id: string | null;
  created_at: Date;
  updated_at: Date;
  customer: { name: string; image: string } | null;
};

type BusinessData = {
  name: string;
  id: string;
};
type propsTypes = {
  reviews: ReviewType[];
  businessData: BusinessData[];
};

const Reviews = (props: propsTypes) => {
  const { reviews, businessData } = props;
  const [sendReview, setSendReview] = useState(false);

  const handleToggleSendContract = () => {
    setSendReview(false);
  };

  return (
    <div>
      <SubmitReviewTamplate
        open={sendReview}
        onClose={handleToggleSendContract}
        businessesName={businessData}
      />

      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">Reviews</h4>
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="p-4"
            onClick={() => {
              setSendReview(true);
            }}
          >
            <span className="mr-2 text-sm text-muted text-zinc-400">
              Add Reviews
            </span>
          </Button>
        </div>
      </div>
      {reviews.length > 0 ? (
        reviews.map((review: ReviewType) => (
          <div key={review.id}>
            <Review reviewData={review!} />
          </div>
        ))
      ) : (
        <span>No Reviews</span>
      )}
    </div>
  );
};

export default Reviews;
