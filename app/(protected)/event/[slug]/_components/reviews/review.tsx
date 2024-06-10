import RichEditor from "@/components/shared/rich-editor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitial } from "@/lib/common";
import React, { useState } from "react";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa6";
import Rating from "react-rating";

type ReviewType = {
  id: string;
  business_id: string | null;
  description: string | null;
  created_at: Date;
  updated_at: Date;
  title: string | null;
  customer_id: string | null;
  event_id: string | null;
  rating: number;
  customer: { name: string; image: string } | null;
};

type propsType = {
  reviewData: ReviewType;
};
const Review = (props: propsType) => {
  const { reviewData } = props;

  // Parse the timestamp
  const date = new Date(reviewData.created_at);

  // Define options for formatting
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  // Format the date to the desired format
  const formattedDate = date
    .toLocaleString("en-US", options)
    .replace(",", "")
    .replace(" at", ",");

  return (
    <div>
      <div className="flex flex-col gap-4 my-10">
        <hr />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={reviewData.customer?.image ?? undefined}
                alt="name"
                className="object-cover"
              />
              <AvatarFallback>
                {getInitial(reviewData.customer?.name ?? "")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              {reviewData.customer?.name}
              <span className="text-[9px]">{formattedDate!}</span>
            </div>
          </div>
          <div className="flex flex-col text-2xl text-end">
            <Rating
              emptySymbol={<CiStar />}
              fullSymbol={<FaStar />}
              fractions={2}
              readonly
              initialRating={reviewData.rating}
            />
          </div>
        </div>
        <RichEditor readOnly value={reviewData.description!} />
      </div>
    </div>
  );
};

export default Review;
