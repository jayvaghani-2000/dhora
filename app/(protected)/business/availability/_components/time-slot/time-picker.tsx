import CustomSelect from "@/components/shared/custom-select";
import { useOptions } from "@/lib/hook/useOptions";
import React, { useEffect } from "react";
import dayjs, { ConfigType } from "@/lib/dayjs";

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
    <div className="w-[130px]">
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
        placeholder="Select time"
        value={options
          .find(option => option.value === dayjs(value).toDate().valueOf())
          ?.value.toString()}
        options={options.map(i => ({ ...i, value: i.value.toString() }))}
      />
    </div>
  );
};

export default TimePicker;
