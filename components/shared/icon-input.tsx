import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "prefix"
> & {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
};

const IconInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const { suffix, prefix, ...rest } = props;
    return (
      <div className="flex items-center h-8 lg:h-10 rounded-md border border-input px-1 bg-background py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-offset-2 ">
        {prefix ? prefix : null}
        <input
          type={type}
          className={cn(
            "pl-1 w-full flex-1 border-none outline-none bg-transparent disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...rest}
        />
        {suffix ? suffix : null}
      </div>
    );
  }
);
IconInput.displayName = "Input";

export { IconInput };
