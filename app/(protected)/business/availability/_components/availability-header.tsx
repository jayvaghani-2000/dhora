import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { useRef, useState } from "react";
import Spinner from "@/components/shared/spinner";
import { useParams } from "next/navigation";
import { deleteAvailability } from "@/actions/(protected)/availability/deleteAvailability";

type propType = {
  handleUpdateAvailability: () => void;
  loading: boolean;
  name: string;
  isDefault: boolean;
  alreadyDefault: boolean;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setIsDefault: React.Dispatch<React.SetStateAction<boolean>>;
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
  } = props;
  const params = useParams();
  const inputRef = useRef<HTMLInputElement>(null!);
  const [hideEditIcon, setHideEditIcon] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAvailability = async () => {
    setDeleting(true);
    await deleteAvailability(params.availability_id as string);
    setDeleting(false);
  };

  return (
    <div className="flex flex-col gap-1 lg:flex-row justify-between lg:items-center">
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
            disabled={alreadyDefault}
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
  );
};

export default AvailabilityHeader;
