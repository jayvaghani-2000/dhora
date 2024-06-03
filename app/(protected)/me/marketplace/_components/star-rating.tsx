import React from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

const StarRating = ({
  rating,
  maxRating = 5,
}: {
  rating: number;
  maxRating: number;
}) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  for (let i = 1; i <= maxRating; i++) {
    if (i <= fullStars) {
      stars.push(<FaStar key={i} className="text-gray-500" />);
    } else if (hasHalfStar && i === fullStars + 1) {
      stars.push(<FaStarHalfAlt key={i} className="text-gray-500" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-gray-700" />);
    }
  }

  return <div className="flex">{stars}</div>;
};

export default StarRating;
