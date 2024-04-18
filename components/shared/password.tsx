import { useState } from "react";
import { Input } from "../ui/input";
import { IoMdEyeOff } from "react-icons/io";
import { IoMdEye } from "react-icons/io";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Password(props: InputProps) {
  const [view, setView] = useState(false);

  return (
    <div className={`relative w-full`}>
      <Input className="pr-7" type={view ? "text" : "password"} {...props} />
      <button
        className="absolute pr-2 pl-1 z-10 right-0 top-0 bottom-0"
        type="button"
        onClick={() => setView(prev => !prev)}
      >
        {view ? <IoMdEyeOff /> : <IoMdEye />}
      </button>
    </div>
  );
}
