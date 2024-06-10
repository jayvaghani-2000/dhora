"use client";
import { getBookingTypesType } from "@/actions/_utils/types.type";
import React from "react";
import BookingTypeCard from "./booking-types-card";

type propType = {
  data: getBookingTypesType["data"];
};

const BookingTypes = (props: propType) => {
  const { data } = props;

  const bookingType = data!;

  return bookingType.length > 0 ? (
    <div className="mt-4">
      {bookingType.map(i => (
        <BookingTypeCard key={i.id} data={i} />
      ))}
    </div>
  ) : null;
};

export default BookingTypes;
