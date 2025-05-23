import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { useRef, useState } from "react";
import Spinner from "@/components/shared/spinner";
import { useParams } from "next/navigation";
import { deleteAvailability } from "@/actions/(protected)/business/availability/deleteAvailability";
import { getAvailabilityDetailType } from "@/actions/_utils/types.type";
import { availabilityAsString } from "../_utils/initializeAvailability";
import BackButton from "@/components/shared/back-button";
import { useToast } from "@/components/ui/use-toast";

type propType = {
  handleUpdateAvailability: () => void;
  loading: boolean;
  name: string;
  isDefault: boolean;
  alreadyDefault: boolean;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setIsDefault: React.Dispatch<React.SetStateAction<boolean>>;
  availabilityDetail: getAvailabilityDetailType["data"];
};

const AvailabilityHeader = (props: propType) => {
  const {
    name,
    handleUpdateAvailability,
    loading,
    isDefault,
    alreadyDefault,
    setIsDefault,
    setName,
    availabilityDetail,
  } = props;
  const params = useParams();
  const inputRef = useRef<HTMLInputElement>(null!);
  const [hideEditIcon, setHideEditIcon] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const handleDeleteAvailability = async () => {
    setDeleting(true);
    const res = await deleteAvailability(params.availability_id as string);
    if (res && !res.success) {
      toast({ title: res.error });
    } else {
      toast({ title: "Availability deleted successfully!" });
    }
    setDeleting(false);
  };

  return (
    <div className="flex gap-2 ">
      <BackButton to="/business/availability" icon={true} />

      <div className="flex flex-col flex-1 gap-1 lg:flex-row justify-between lg:items-center">
        <div className="flex flex-col gap-1">
          <div className="flex gap-1 items-center">
            <div className="relative w-min ">
              <span className="invisible whitespace-pre	px-1 ">{name}</span>
              <input
                value={name}
                ref={inputRef}
                onBlur={() => {
                  setHideEditIcon(false);
                }}
                onFocus={() => {
                  setHideEditIcon(true);
                }}
                className="absolute left-0 p-0 w-full font-semibold border-none outline-none bg-transparent max-w-fit"
                onChange={e => setName(e.target.value)}
              ></input>
            </div>
            {!hideEditIcon ? (
              <Button
                variant="link"
                className="p-0 h-fit"
                onClick={() => {
                  inputRef.current.focus();
                  setHideEditIcon(true);
                }}
              >
                <MdEdit size={18} color="#b6b6b6" />
              </Button>
            ) : null}
          </div>
          <div className="flex flex-col  text-secondary-light-gray">
            {availabilityAsString(availabilityDetail!, {
              locale: "en",
              hour12: true,
            }).map(i => (
              <span className="text-xs text-secondary-light-gray" key={i}>
                {i}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex items-center space-x-2">
            <Label
              htmlFor={`set_as_default`}
              className="font-semibold cursor-pointer"
            >
              Set to Default
            </Label>
            <Switch
              id={`set_as_default`}
              checked={isDefault}
              onCheckedChange={checked => {
                setIsDefault(checked);
              }}
            />
          </div>
          <Separator orientation="vertical" className="w-0.5 h-8" />
          <Button
            variant="outline"
            className="p-1 h-[28px]"
            disabled={deleting}
            onClick={() => {
              handleDeleteAvailability();
            }}
          >
            <RiDeleteBin6Line size={18} color="#b6b6b6" />
          </Button>
          <Separator orientation="vertical" className="w-0.5 h-8" />
          <Button
            onClick={handleUpdateAvailability}
            disabled={loading || deleting}
            className="h-fit lg:h-auto"
          >
            Save {loading && <Spinner type="inline" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityHeader;
