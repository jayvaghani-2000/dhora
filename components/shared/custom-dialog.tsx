"use client";
import React, { HTMLProps, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Spinner from "./spinner";

type propType = {
  title?: string;
  closable?: boolean;
  className?: HTMLProps<HTMLElement>["className"];
  children?: React.ReactNode;
  open: boolean;
  saveText?: string;
  disableAction?: boolean;
  onClose?: () => void;
  onSubmit?: () => void;
  saveVariant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";
};

const CustomDialog = (prop: propType) => {
  const {
    title,
    closable = true,
    className = "",
    open,
    onClose = () => {},
    children,
    saveText = "Save",
    saveVariant = "default",
    disableAction = false,
    onSubmit = async () => {},
  } = prop;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyPress = async (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        setLoading(true);
        await onSubmit();
        setLoading(false);
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

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
        className={cn(
          "max-w-[calc(100dvw-40px)] max-h-[calc(100dvh-40px)] p-0 overflow-auto",
          className
        )}
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
        <DialogFooter className="flex-row relative bg-gradient px-3 md:px-6 py-3 flex justify-end items-center rounded-b-sm before:content-[''] before:absolute before:inset-0 before:bg-background before:opacity-75 gap-2">
          {closable ? (
            <Button
              variant="outline"
              disabled={loading || disableAction}
              className="relative z-10"
              onClick={onClose}
            >
              Cancel
            </Button>
          ) : null}
          <Button
            variant={saveVariant}
            disabled={loading || disableAction}
            onClick={async () => {
              setLoading(true);
              await onSubmit();
              setLoading(false);
            }}
            className="relative z-10"
          >
            {saveText}{" "}
            {loading || disableAction ? <Spinner type="inline" /> : null}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
