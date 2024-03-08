"use client";
import React, { HTMLProps } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type propType = {
  title?: string;
  closable?: boolean;
  className?: HTMLProps<HTMLElement>["className"];
  children?: React.ReactNode;
  open: boolean;
  onClose?: () => void;
};

const CustomDialog = (prop: propType) => {
  const {
    title,
    closable = true,
    className = "",
    open,
    onClose = () => {},
    children,
  } = prop;
  return (
    <Dialog
      open={open}
      onOpenChange={value => {
        if (!value) {
          onClose();
        }
      }}
    >
      <DialogContent
        className={cn("max-w-[calc(100dvw-40px)] p-0", className)}
        closable={closable}
      >
        {title ? (
          <DialogHeader>
            <DialogTitle className="text-2xl border-b border-divider px-3 md:px-6 py-3">
              {title}
            </DialogTitle>
          </DialogHeader>
        ) : null}

        {children ? <div className="px-3 md:px-6 py-2">{children}</div> : null}
        <DialogFooter className="flex-row relative bg-gradient px-3 md:px-6 py-3 flex justify-end items-center rounded-b-sm before:content-[''] before:absolute before:inset-0 before:bg-background before:opacity-50 gap-2">
          <Button variant="outline" className="relative z-10">
            Cancel
          </Button>
          <Button variant="default" className="relative z-10">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
