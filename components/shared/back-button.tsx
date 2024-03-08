import React from "react";
import { MdArrowBackIos } from "react-icons/md";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const BackButton = ({ to }: { to?: string }) => {
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        if (to) {
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
