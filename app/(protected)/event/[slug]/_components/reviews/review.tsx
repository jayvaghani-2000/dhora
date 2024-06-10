import { getReviewsType } from "@/actions/_utils/types.type";
import RatingWrapper from "@/components/shared/rating";
import RichEditor from "@/components/shared/rich-editor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitial, timeZone } from "@/lib/common";
import React from "react";
import dayjs from "@/lib/dayjs";

type propsType = {
  reviewData: getReviewsType["data"][0];
};
const Review = (props: propsType) => {
  const { reviewData } = props;

  const formattedCreatedAt = dayjs
    .utc(reviewData.created_at)
    .tz(timeZone)
    .format("LLL");

  return (
    <div className="flex flex-col gap-3 my-3">
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
            <span className="text-[9px]">{formattedCreatedAt!}</span>
          </div>
        </div>
        <div className="flex flex-col text-2xl text-end">
          <RatingWrapper
            readonly={true}
            onClick={() => {}}
            fractions={10}
            initialRating={reviewData.rating}
          />
        </div>
      </div>
      <RichEditor readOnly value={reviewData.description!} />
    </div>
  );
};

export default Review;
