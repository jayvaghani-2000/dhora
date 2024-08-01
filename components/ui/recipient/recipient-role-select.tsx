"use client";

import React, { forwardRef } from "react";

import type { SelectProps } from "@radix-ui/react-select";
import { InfoIcon } from "lucide-react";

import { RecipientRole } from "@/lib/types/recipient-role";
import { ROLE_ICONS } from "./recipient-role-icons";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";

export type RecipientRoleSelectProps = SelectProps & {
  hideCCRecipients?: boolean;
};

export const RecipientRoleSelect = forwardRef<
  HTMLButtonElement,
  RecipientRoleSelectProps
>(({ hideCCRecipients, ...props }, ref) => (
  <Select {...props}>
    <SelectTrigger ref={ref} className="bg-background w-[60px]">
      {ROLE_ICONS[props.value as RecipientRole]}
    </SelectTrigger>

    <SelectContent align="end">
      <SelectItem value={RecipientRole.SIGNER}>
        <div className="flex items-center">
          <div className="flex w-[150px] items-center">
            <span className="mr-2">{ROLE_ICONS[RecipientRole.SIGNER]}</span>
            Needs to sign
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent className="text-foreground z-9999 max-w-md p-4">
                <p>
                  The recipient is required to sign the document for it to be
                  completed.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </SelectItem>

      <SelectItem value={RecipientRole.APPROVER}>
        <div className="flex items-center">
          <div className="flex w-[150px] items-center">
            <span className="mr-2">{ROLE_ICONS[RecipientRole.APPROVER]}</span>
            Needs to approve
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent className="text-foreground z-9999 max-w-md p-4">
                <p>
                  The recipient is required to approve the document for it to be
                  completed.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </SelectItem>

      <SelectItem value={RecipientRole.VIEWER}>
        <div className="flex items-center">
          <div className="flex w-[150px] items-center">
            <span className="mr-2">{ROLE_ICONS[RecipientRole.VIEWER]}</span>
            Needs to view
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent className="text-foreground z-9999 max-w-md p-4">
                <p>
                  The recipient is required to view the document for it to be
                  completed.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </SelectItem>

      {!hideCCRecipients && (
        <SelectItem value={RecipientRole.CC}>
          <div className="flex items-center">
            <div className="flex w-[150px] items-center">
              <span className="mr-2">{ROLE_ICONS[RecipientRole.CC]}</span>
              Receives copy
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent className="text-foreground z-9999 max-w-md p-4">
                  <p>
                    The recipient is not required to take any action and
                    receives a copy of the document after it is completed.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </SelectItem>
      )}
    </SelectContent>
  </Select>
));

RecipientRoleSelect.displayName = "RecipientRoleSelect";
