"use client"
import { getReviewsType } from "@/actions/_utils/types.type";
import Review from "@/components/review/review";
import React from "react";

type propType = {
  reviews: getReviewsType["data"];
};

const Reviews = (prop: propType) => {
  const { reviews } = prop;

  return <>
  <div className="text-secondary-light-gray font-semibold text-base">
    Reviews({reviews.length})
  </div>
  
  {reviews.map(review => {
    console.log("review", review);
    return (
      <div key={review.id}>
        <Review reviewData={review} />
      </div>
    )})}
</>
};

export default Reviews;
