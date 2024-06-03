import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  data: string[];
  placeHolder: string;
  setValue: (value: string) => void;
}

const SelectButton = (props: Props) => {
  const handleSelect = (value: string) => {
    props.setValue(value);
  };

  return (
    <Select
      onValueChange={value => {
        handleSelect(value);
      }}
    >
      <SelectTrigger className="lg:w-[180px] text-gray-500">
        <SelectValue placeholder={props.placeHolder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {props.data.map((value, index) => (
            <SelectItem value={value} key={index}>
              {value}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectButton;
