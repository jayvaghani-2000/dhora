"use client";
import { profileType } from "@/actions/_utils/types.type";
import RichEditor from "@/components/shared/rich-editor";
import { Separator } from "@/components/ui/separator";
import { CiLocationOn } from "react-icons/ci";

type propTypes = { user: profileType };

const BusinessDetails = (props: propTypes) => {
  const { user } = props;
  return (
    <div>
      <span className="font-bold text-2xl lg:text-4xl">
        {user?.business?.name}
      </span>

      {user?.business?.address ? (
        <div className="flex gap-1 items-center mt-1">
          <CiLocationOn className="h-4 w-4" />
          <span className="font-normal text-xs">{user?.business?.address}</span>
        </div>
      ) : null}

      <Separator className="mt-2 mb-4" />

      <div className="flex flex-col  text-white ">
        <RichEditor
          value={user?.business?.description ?? ""}
          readOnly
          readOnlyClass=""
        />
      </div>
    </div>
  );
};

export default BusinessDetails;
