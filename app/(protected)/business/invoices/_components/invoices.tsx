"use client";
import { getInvoicesResponseType } from "@/actions/_utils/types.type";
import { ColumnDef, Table } from "@tanstack/react-table";
import { formatAmount, formatDate } from "@/lib/common";
import React from "react";
import { CustomTable } from "@/components/shared/custom-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import { isWithinInterval } from "date-fns";
import { DateRangePicker } from "@/components/shared/range-picker";

type propType = {
  invoices: getInvoicesResponseType["data"];
};

type recordType = {
  email: string;
  created_on: string;
  amount: number;
  id: string;
};

type extraFilterPropType = {
  table: Table<recordType>;
};

const ExtraFilters = (props: extraFilterPropType) => {
  const { table } = props;

  return (
    <div className="flex gap-2 flex-wrap">
      <DateRangePicker
        onChange={range => {
          if (range?.from && range.to) {
            table
              .getColumn("created_on")
              ?.setFilterValue(JSON.stringify(range));
          } else {
            table
              .getColumn("created_on")
              ?.setFilterValue(JSON.stringify(undefined));
          }
        }}
        value={
          table.getColumn("created_on")?.getFilterValue()
            ? JSON.parse(
                (table.getColumn("created_on")?.getFilterValue() as string) ??
                  ""
              )
            : {
                from: undefined,
                to: undefined,
              }
        }
        placeholder="Pick a created on date"
      />
    </div>
  );
};

const Invoices = (props: propType) => {
  const { invoices } = props;

  const parsedInvoices: recordType[] = invoices!.map(i => ({
    id: String(i.id),
    email: i.customer_email,
    created_on: formatDate(i.created_at),
    amount: Number(i.total),
  }));

  const columns: ColumnDef<recordType>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "email",
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
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "created_on",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created on
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("created_on")}</div>,
      filterFn: (row, column, filter) => {
        const filterObj = JSON.parse(filter);
        if (filterObj === "undefined") return true;
        const inRange = isWithinInterval(new Date(row.original.created_on), {
          start: filterObj?.from,
          end: filterObj?.to,
        });

        return inRange;
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => (
        <div>{formatAmount(Number(row.getValue("amount")))}</div>
      ),
    },
  ];

  return parsedInvoices.length > 0 ? (
    <CustomTable
      data={[...parsedInvoices]}
      columns={columns}
      extraFilters={ExtraFilters}
    />
  ) : null;
};

export default Invoices;
