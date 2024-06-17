import { getBookingsType } from "@/actions/_utils/types.type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import BookingCard from "./booking-card";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { LuCalendar } from "react-icons/lu";

type propType = {
  bookings: getBookingsType["data"];
  isButtonVisible: boolean;
};

const UserBookings = (prop: propType) => {
  const { bookings } = prop;
  const { pastBookings, upcomingBookings } = bookings!;

  return (
    <Tabs defaultValue="upcoming">
      <div className="flex justify-between gap-5 mb-2">
        <TabsList className="overflow-auto flex items-start justify-start max-w-full w-fit scrollbar-hide ">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="upcoming" className="flex mt-0 flex-col gap-2">
        {upcomingBookings.length > 0 ? (
          upcomingBookings.map(booking => (
            <BookingCard
              data={booking}
              key={booking.id}
              isButtonVisible={prop.isButtonVisible}
            />
          ))
        ) : (
          <div className="flex h-full">
            <Card className="flex-1 border border-dashed flex justify-center items-center text-center  m-auto">
              <CardHeader className="flex justify-center items-center">
                <div className="text-4xl bg-gray-800 rounded-full w-fit p-3">
                  <LuCalendar />
                </div>
                <CardTitle>No upcoming bookings</CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}
      </TabsContent>
      <TabsContent value="past" className="flex mt-0 flex-col gap-2">
        {pastBookings.length > 0 ? (
          pastBookings.map(booking => (
            <BookingCard
              data={booking}
              key={booking.id}
              isButtonVisible={prop.isButtonVisible}
            />
          ))
        ) : (
          <div className="flex h-full">
            <Card className="flex-1 border border-dashed flex justify-center items-center text-center  m-auto">
              <CardHeader className="flex justify-center items-center">
                <div className="text-4xl bg-gray-800 rounded-full w-fit p-3">
                  <LuCalendar />
                </div>
                <CardTitle>No past bookings</CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default UserBookings;
