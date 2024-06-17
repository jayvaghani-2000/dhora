import React from "react";
import Room from "./room";

const RoomLayout = ({ res }: any) => {
  const token = res.data!.token;

  if (token === "") {
    return <div>Please wait...</div>;
  }

  if (token !== "") {
    return <Room token={token} />;
  }
};

export default RoomLayout;
