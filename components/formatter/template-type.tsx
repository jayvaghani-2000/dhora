import type { HTMLAttributes } from "react";

import { Globe2, Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react/dist/lucide-react";

import type { TemplateType as TemplateTypeLib } from "@/lib/types/template-types";
import { cn } from "@/lib/utils";

type TemplateTypeIcon = {
  label: string;
  icon?: LucideIcon;
  color: string;
};

const TEMPLATE_TYPES: Record<TemplateTypeLib, TemplateTypeIcon> = {
  PRIVATE: {
    label: "Private",
    icon: Lock,
    color: "text-blue-600 dark:text-blue-300",
  },
  PUBLIC: {
    label: "Public",
    icon: Globe2,
    color: "text-green-500 dark:text-green-300",
  },
};

export type TemplateTypeProps = HTMLAttributes<HTMLSpanElement> & {
  type: TemplateTypeLib;
  inheritColor?: boolean;
};

export const TemplateType = ({
  className,
  type,
  inheritColor,
  ...props
}: TemplateTypeProps) => {
  const { label, icon: Icon, color } = TEMPLATE_TYPES[type];

  return (
    <span className={cn("flex items-center", className)} {...props}>
      {Icon && (
        <Icon
          className={cn("mr-2 inline-block h-4 w-4", {
            [color]: !inheritColor,
          })}
        />
      )}
      {label}
    </span>
  );
};
