"use client";
import React, { useState } from "react";
import SubmitReviewTamplate from "./popup";
import Review from "./review";
import { Button } from "@/components/ui/button";
import { getReviewsType } from "@/actions/_utils/types.type";


type BusinessData = {
  name: string;
  id: string;
};
type propsTypes = {
  reviews: getReviewsType["data"];
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

      <div className="flex items-center justify-between space-x-4">
        <h4 className="text-sm font-semibold">Reviews</h4>
        <div>
          <Button
            size="sm"
            className="p-4"
            onClick={() => {
              setSendReview(true);
            }}
          >
              Add Reviews
          </Button>
        </div>
      </div>
      {reviews.length > 0 ? (
        reviews.map((review) => (
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
