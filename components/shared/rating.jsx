import React from 'react';
import Rating from 'react-rating';
import { FaStar, FaRegStar } from 'react-icons/fa6';


const RatingWrapper = ({ initialRating, onClick, readonly, fractions }) => {
  return (
    <Rating
      emptySymbol={<FaRegStar size={18}/>}
      fullSymbol={<FaStar size={18}/>}
      fractions={fractions}
      initialRating={initialRating}
      onClick={onClick}
      readonly={readonly}
    />
  );
};

export default RatingWrapper;
