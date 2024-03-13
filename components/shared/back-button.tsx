import React from "react";
import { MdArrowBackIos } from "react-icons/md";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { revalidate } from "@/actions/(public)/revalidate";

const BackButton = ({ to }: { to?: string }) => {
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
    >
      <MdArrowBackIos />
      <span>Back</span>
    </Button>
  );
};

export default BackButton;
