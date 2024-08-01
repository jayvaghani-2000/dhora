"use client";

import { useTransition } from "react";

import {
  Globe2Icon,
  InfoIcon,
  Link2Icon,
  Loader,
  LockIcon,
} from "lucide-react";

import { useUpdateSearchParams } from "@/lib/client-only/hooks/use-update-search-params";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { LocaleDate } from "@/components/formatter/locale-date";
import { TemplateType } from "@/components/formatter/template-type";

import { DataTableActionDropdown } from "./data-table-action-dropdown";
import { DataTableTitle } from "./data-table-title";
import { UseTemplateDialog } from "./use-template-dialog";

type TemplatesDataTableProps = {
  templates: any[];
  perPage: number;
  page: number;
  totalPages: number;
};

export const TemplatesDataTable = ({
  templates,
  perPage,
  page,
  totalPages,
}: TemplatesDataTableProps) => {
  console.log(templates);
  const [isPending, startTransition] = useTransition();

  const updateSearchParams = useUpdateSearchParams();

  const onPaginationChange = (page: number, perPage: number) => {
    startTransition(() => {
      updateSearchParams({
        page,
        perPage,
      });
    });
  };

  return (
    <div className="relative">
      <DataTable
        columns={[
          {
            header: "Created",
            accessorKey: "createdAt",
            cell: ({ row }) => <LocaleDate date={row.original.created_at} />,
          },
          {
            header: "Title",
            cell: ({ row }) => <DataTableTitle row={row.original} />,
          },
          {
            header: () => (
              <div className="flex flex-row items-center">
                Type
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="mx-2 h-4 w-4" />
                    </TooltipTrigger>

                    <TooltipContent className="text-foreground max-w-md space-y-2 !p-0">
                      <ul className="text-muted-foreground space-y-0.5 divide-y [&>li]:p-4">
                        <li>
                          <h2 className="mb-2 flex flex-row items-center font-semibold">
                            <Globe2Icon className="mr-2 h-5 w-5 text-green-500 dark:text-green-300" />
                            Public
                          </h2>

                          <p>
                            Public templates are connected to your public
                            profile. Any modifications to public templates will
                            also appear in your public profile.
                          </p>
                        </li>
                        <li>
                          <div className="mb-2 flex w-fit flex-row items-center rounded border border-neutral-300 bg-neutral-200 px-1.5 py-0.5 text-xs dark:border-neutral-500 dark:bg-neutral-600">
                            <Link2Icon className="mr-1 h-3 w-3" />
                            direct link
                          </div>

                          <p>
                            Direct link templates contain one dynamic recipient
                            placeholder. Anyone with access to this link can
                            sign the document, and it will then appear on your
                            documents page.
                          </p>
                        </li>
                        <li>
                          <h2 className="mb-2 flex flex-row items-center font-semibold">
                            <LockIcon className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-300" />
                            Private
                          </h2>

                          <p>
                            Private templates can only be modified and viewed by
                            you.
                          </p>
                        </li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ),
            accessorKey: "type",
            cell: () => (
              <div className="flex flex-row items-center">
                <TemplateType type="PRIVATE" />
              </div>
            ),
          },
          {
            header: "Actions",
            accessorKey: "actions",
            cell: ({ row }) => {
              return (
                <div className="flex items-center gap-x-4">
                  <UseTemplateDialog
                    templateId={row.original.id}
                    recipients={row?.original?.recipients ?? []}
                  />

                  <DataTableActionDropdown row={row.original} />
                </div>
              );
            },
          },
        ]}
        data={templates}
        perPage={perPage}
        currentPage={page}
        totalPages={totalPages}
        onPaginationChange={onPaginationChange}
      >
        {table => (
          <DataTablePagination
            additionalInformation="VisibleCount"
            table={table}
          />
        )}
      </DataTable>

      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
          <Loader className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      )}
    </div>
  );
};
