import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ActionTooltip } from "@/components/shared/action-tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  path: string;
  tooltip: string;
  key?: string;
  children: ReactNode;
}

export default function PrimaryNavbarItem(props: Props) {
  const pathname = usePathname();
  const { path, children, tooltip } = props;

  return (
    <div>
      <ActionTooltip side="right" align="center" label={tooltip}>
        <Link href={path}>
          <Button variant="ghost" className="w-[48px] h-[48px]">
            <span>{children}</span>
          </Button>
        </Link>
      </ActionTooltip>
    </div>
  );
}
