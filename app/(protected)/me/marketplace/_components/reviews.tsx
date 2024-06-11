"use client";
import { Progress } from "@/components/ui/progress";
import React from "react";
import Review from "@/components/review/review";
import { getBusinessDetailsType, getReviewsType } from "@/actions/_utils/types.type";
import { Label } from "@/components/ui/label";

type rating_Summary_type = {
  total_ratings: string;
  average_rating: number;
  count_rating_1: string;
  count_rating_2: string;
  count_rating_3: string;
  count_rating_4: string;
  count_rating_5: string;
};
type propType = {
  reviews: getReviewsType["data"];
  rating_summary: getBusinessDetailsType["data"]["rating_summary"];
};

const Reviews = (prop: propType) => {
  const { reviews, rating_summary } = prop;

  const summary = rating_summary;
  const totalRatings = summary.total_ratings as unknown as number;
  const ratingPercentages: {[key: string]:  string} = {};

  for (let i = 1; i <= 5; i++) {
    const key = `count_rating_${i}` as keyof getBusinessDetailsType["data"]["rating_summary"];
    ratingPercentages[key] = String((parseInt(summary[key] as string) / totalRatings) * 100);
  }

  // Format percentages to two decimal places
  for (let key in ratingPercentages) {
    ratingPercentages[key] = parseFloat(ratingPercentages[key]).toFixed(2);
  }

  return (
    <>
      <div className="text-secondary-light-gray font-semibold text-base">
        Reviews({reviews.length})
      </div>

      <div className="flex w-full items-center gap-7">
        <div className="flex flex-col items-center gap-2">
          <Label className="text-4xl">
            {Number(rating_summary.average_rating).toFixed(1)}
          </Label>
          <Label>{rating_summary.total_ratings} Ratings</Label>
        </div>
        <div className="flex flex-col gap-4 w-72">
          <span className="flex items-center gap-2">
            <Label className="whitespace-nowrap">5 star</Label>
            <Progress value={parseFloat(ratingPercentages.count_rating_5)} />
          </span>
          <span className="flex items-center gap-2">
            <Label className="whitespace-nowrap">4 star</Label>
            <Progress value={parseFloat(ratingPercentages.count_rating_4)} />
          </span>
          <span className="flex items-center gap-2">
            <Label className="whitespace-nowrap">3 star</Label>
            <Progress value={parseFloat(ratingPercentages.count_rating_3)} />
          </span>
          <span className="flex items-center gap-2">
            <Label className="whitespace-nowrap">2 star</Label>
            <Progress value={parseFloat(ratingPercentages.count_rating_2)} />
          </span>
          <span className="flex items-center gap-2">
            <Label className="whitespace-nowrap">1 star</Label>
            <Progress value={parseFloat(ratingPercentages.count_rating_1)} />
          </span>
        </div>
      </div>
      {reviews.map(review => {
        return (
          <div key={review.id}>
            <Review reviewData={review} />
          </div>
        );
      })}
    </>
  );
};

export default Reviews;
