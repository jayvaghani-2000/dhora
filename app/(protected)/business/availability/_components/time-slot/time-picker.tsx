import CustomSelect from "@/components/shared/custom-select";
import { useOptions } from "@/lib/hook/useOptions";
import React, { useEffect } from "react";
import { ConfigType } from "@/lib/dayjs";
import { localTimeValue } from "../../_utils/initializeAvailability";

type propType = {
  value?: ConfigType;
  min?: ConfigType;
  max?: ConfigType;
  onChange: (value: number) => void;
};

const TimePicker = ({ value, max, min, onChange }: propType) => {
  const { filter, options } = useOptions(12);

  useEffect(() => {
    filter({ current: value });
  }, [filter]);

  return (
    <div className="w-[105px]">
      <CustomSelect
        onChange={value => {
          onChange(+value);
        }}
        onOpenChange={open => {
          if (open) {
            if (min) filter({ offset: min });
            if (max) filter({ limit: max });
          } else {
            filter({ current: value });
          }
        }}
        className="px-2"
        placeholder="Select"
        value={options
          .find(option => option.value === localTimeValue(value))
          ?.value.toString()}
        options={options.map(i => ({ ...i, value: i.value.toString() }))}
      />
    </div>
  );
};

export default TimePicker;
