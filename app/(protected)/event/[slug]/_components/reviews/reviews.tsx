'use client'
import React, { useEffect, useState } from 'react'
import SubmitReviewTamplate from './popup';
import { Button } from '@/components/ui/button';
import { getEventBusiness } from '@/actions/(protected)/customer/events/getEventBusiness';
import { CiStar } from 'react-icons/ci';
import { FaStar } from 'react-icons/fa6';
import Rating from 'react-rating';

type Review = {
    id: string;
    business_id: string | null;
    description: string | null;
    created_at: Date;
    updated_at: Date;
    title: string | null;
    customer_id: string | null;
    event_id: string | null;
    rating: number;
};

type BusinessData = {
    name: string
    id: string
}
type propsTypes = {
    reviews: Review[],
    businessData: BusinessData[]
}

const Reviews = (props: propsTypes) => {
    const { reviews, businessData } = props
    const [sendReview, setSendReview] = useState(false);

    const handleToggleSendContract = () => {
        setSendReview(false);
    }

    console.log(sendReview)

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
                    <Button variant="ghost" size="sm" className="p-4" onClick={() => {
                        setSendReview(true);
                    }}>
                        <span className="mr-2 text-sm text-muted text-zinc-400">
                            Add Reviews
                        </span>
                    </Button>
                </div>
            </div>

            <div>
                <div className='flex justify-between'>
                    <div>
                        <div className='border border-red-900 rounded-full w-[50px] h-[50px] overflow-hidden items-center justify-center flex'>image</div>
                        <div>

                        </div>
                    </div>
                    <div className='text-2xl'>
                        <Rating
                            emptySymbol={<CiStar />}
                            fullSymbol={<FaStar />}
                            fractions={2}
                            readonly
                            initialRating={2.5}
                        />
                    </div>
                </div>
                <div>
                    description
                </div>
            </div>
        </div>
    )
}

export default Reviews