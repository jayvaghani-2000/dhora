"use client";

import React from "react";
import { getSubmittedContractEventResponseType, getSubmittedContractResponseType } from "@/actions/_utils/types.type";
import { ColumnDef, Table } from "@tanstack/react-table";
import { formatDate } from "@/lib/common";
import clsx from "clsx";
import { CustomTable } from "@/components/shared/custom-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import CustomSelect from "@/components/shared/custom-select";
import { DateRangePicker } from "@/components/shared/range-picker";
import { isWithinInterval } from "date-fns";
import Actions from "./actions";

type propType = {
  templates: getSubmittedContractResponseType["data"] | getSubmittedContractEventResponseType["data"];
  showAction: boolean;
};

export type recordType = {
  name: string;
  submitter_email: string;
  status: string;
  sent_on: string;
  id: string;
};

type extraFilterPropType = {
  table: Table<recordType>;
};

const ExtraFilters = (props: extraFilterPropType) => {
  const { table } = props;

  return (
    <div className="flex gap-2 flex-wrap">
      <div className="w-[180px]">
        <CustomSelect
          onChange={value => {
            table.getColumn("status")?.setFilterValue(value);
          }}
          value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
          options={[
            {
              label: "Completed",
              value: "completed",
              className: "text-green-600",
            },
            {
              label: "Sent",
              value: "sent",
              className: "text-pink-700",
            },
            {
              label: "Opened",
              value: "opened",
              className: "text-yellow-600",
            },
          ]}
        />
      </div>

      <DateRangePicker
        onChange={range => {
          if (range?.from && range.to) {
            table.getColumn("sent_on")?.setFilterValue(JSON.stringify(range));
          } else {
            table
              .getColumn("sent_on")
              ?.setFilterValue(JSON.stringify(undefined));
          }
        }}
        value={
          table.getColumn("sent_on")?.getFilterValue()
            ? JSON.parse(
              (table.getColumn("sent_on")?.getFilterValue() as string) ?? ""
            )
            : {
              from: undefined,
              to: undefined,
            }
        }
        placeholder="Pick a sent on date"
      />
    </div>
  );
};

const SubmittedContract = (props: propType) => {
  const { templates, showAction } = props;

  console.log(templates)

  const parsedTemplate: recordType[] = templates!.map(i => ({
    name: i.template.name,
    submitter_email: i.submitters[0].email,
    status: i.submitters[0].status,
    sent_on: formatDate(i.submitters[0].sent_at),
    id: String(i.id),
  }));

  const columns: ColumnDef<recordType>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "submitter_email",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("submitter_email")}</div>,
    },
    {
      accessorKey: "sent_on",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Sent on
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("sent_on")}</div>,
      filterFn: (row, column, filter) => {
        const filterObj = JSON.parse(filter);
        if (filterObj === "undefined") return true;
        const inRange = isWithinInterval(new Date(row.original.sent_on), {
          start: filterObj?.from,
          end: filterObj?.to,
        });

        return inRange;
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => {
        return (
          <div
            className={clsx({
              "relative capitalize flex gap-1 items-center before:content-['']  before:h-2 before:w-2 before:rounded-full":
                true,
              "text-green-600 hover:text-green-600 before:bg-green-600":
                row.getValue("status") === "completed",
              "text-pink-700 hover:text-pink-700 before:bg-pink-700":
                row.getValue("status") === "sent",
              "text-yellow-600 hover:text-yellow-600 before:bg-yellow-600":
                row.getValue("status") === "opened",
            })}
          >
            {row.getValue("status")}
          </div>
        );
      },
    },
    
  ];

  const actionColumn = {
    id: "actions",
    enableHiding: false,
    cell: ({ row }:any) => {
      return <Actions row={row} />;
    },
  }

  {showAction && columns.push(actionColumn)}

  return parsedTemplate.length > 0 ? (
    <CustomTable
      data={[...parsedTemplate]}
      columns={columns}
      extraFilters={ExtraFilters}
    />
  ) : null;
};

export default SubmittedContract;
