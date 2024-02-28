import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ActionTooltip } from "@/components/shared/action-tooltip";
import Link from "next/link";
import clsx from "clsx";

export interface PrimaryNavbarProps {
  path: string;
  tooltip: string;
  children: ReactNode;
  active: boolean;
}

export default function PrimaryNavbarItem(props: PrimaryNavbarProps) {
  const { path, children, tooltip, active } = props;

  return (
    <div>
      <ActionTooltip side="right" align="center" label={tooltip}>
        <Link href={path}>
          <Button
            variant="ghost"
            className={clsx({
              // TODO: Set active state to add a halo around the selected icon
              "": active,
              "": !active,
              "w-[48px] h-[48px]": true,
            })}
          >
            <span>{children}</span>
          </Button>
        </Link>
      </ActionTooltip>
    </div>
  );
}
