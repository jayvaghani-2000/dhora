"use server";

import "@livekit/components-styles";
import RoomLayout from "./_components";
import { getParticipantToken } from "@/actions/(protected)/livkit/getParticipantToken";

type propType = {
  readonly searchParams: {
    roomId?: string;
  };
};

export default async function Page(props: propType) {
  const { roomId } = props.searchParams;

  const res = await getParticipantToken(roomId!);

  if (!res.success) return <span className="text-center">{res.error}</span>;

  return <RoomLayout res={res} />;
}
