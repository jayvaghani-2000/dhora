import React from "react";
import { IoChevronBack } from "react-icons/io5";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { revalidate } from "@/actions/(public)/revalidate";

const BackButton = ({ to, icon = false }: { to?: string; icon?: boolean }) => {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        if (to) {
          await revalidate(to);
          router.replace(to);
        } else {
          router.back();
        }
      }}
      className="p-2 h-fit lg:px-4 "
    >
      <IoChevronBack />
      {!icon ? <span>Back</span> : null}
    </Button>
  );
};

export default BackButton;
