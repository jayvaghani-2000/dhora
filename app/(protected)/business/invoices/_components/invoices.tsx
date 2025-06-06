"use client";
import { getInvoicesResponseType } from "@/actions/_utils/types.type";
import { ColumnDef, Table } from "@tanstack/react-table";
import { formatAmount, formatDate } from "@/lib/common";
import React, { useState } from "react";
import { CustomTable } from "@/components/shared/custom-table";
import { ArrowUpDown } from "lucide-react";
import { isWithinInterval } from "date-fns";
import { DateRangePicker } from "@/components/shared/range-picker";
import CustomSelect from "@/components/shared/custom-select";
import { IconInput } from "@/components/shared/icon-input";
import { CgDollar } from "react-icons/cg";
import Actions from "./actions";
import clsx from "clsx";
import { invoiceStatusTypeEnum } from "@/db/schema";

type propType = {
  invoices: getInvoicesResponseType["data"];
  showAction: boolean;
};

const statusMode = invoiceStatusTypeEnum.enumValues;

export type recordType = {
  email: string;
  created_on: string;
  due_date: string;
  amount: number;
  id: string;
  status: (typeof statusMode)[number];
  event: string;
  pay_vai: string;
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
      <DateRangePicker
        onChange={range => {
          if (range?.from && range.to) {
            table.getColumn("due_date")?.setFilterValue(JSON.stringify(range));
          } else {
            table
              .getColumn("due_date")
              ?.setFilterValue(JSON.stringify(undefined));
          }
        }}
        value={
          table.getColumn("due_date")?.getFilterValue()
            ? JSON.parse(
                (table.getColumn("due_date")?.getFilterValue() as string) ?? ""
              )
            : {
                from: undefined,
                to: undefined,
              }
        }
        placeholder="Pick a due date"
      />
      <div className="w-[180px]]">
        <CustomSelect
          onChange={value => {
            table.getColumn("status")?.setFilterValue(value);
          }}
          value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
          options={[
            {
              label: "Paid",
              value: "paid",
              className: "text-green-600",
            },
            {
              label: "Overdue",
              value: "overdue",
              className: "text-pink-700",
            },
            {
              label: "Pending",
              value: "pending",
              className: "text-yellow-700",
            },
            {
              label: "Draft",
              value: "draft",
              className: "text-gray-400",
            },
          ]}
        />
      </div>

      <div className="flex gap-1 items-center">
        <span className="text-xs">Amount</span>
        <IconInput
          prefix={
            <div className="h-4 w-4">
              <CgDollar className="h-full w-full" />
            </div>
          }
          type="number"
          onChange={e => {
            const value = parseFloat(e.target.value);
            const filter = table.getColumn("amount")?.getFilterValue() as {
              from: string;
              to: string;
            };
            table
              .getColumn("amount")
              ?.setFilterValue({ ...filter, from: value });
          }}
          placeholder="0.00"
          className="w-20"
        />
        <span className="text-xs">-</span>
        <IconInput
          prefix={
            <div className="h-4 w-4">
              <CgDollar className="h-full w-full" />
            </div>
          }
          type="number"
          onChange={e => {
            const value = parseFloat(e.target.value);
            const filter = table.getColumn("amount")?.getFilterValue() as {
              from: string;
              to: string;
            };
            table.getColumn("amount")?.setFilterValue({ ...filter, to: value });
          }}
          placeholder="100.00"
          className="w-20"
        />
      </div>
    </div>
  );
};

const Invoices = (props: propType) => {
  const { invoices, showAction } = props;

  const parsedInvoices: recordType[] = invoices!.map(i => ({
    id: String(i.id),
    email: i.customer_email,
    created_on: formatDate(i.created_at),
    amount: Number(i.total),
    due_date: formatDate(i.due_date),
    status: i.status,
    event: i.event?.title ?? "-",
    pay_vai: i.pay_via as string,
  }));

  const columns: ColumnDef<recordType>[] = [
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
      accessorKey: "due_date",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Due on
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("due_date")}</div>,
      filterFn: (row, column, filter) => {
        const filterObj = JSON.parse(filter);
        if (filterObj === "undefined") return true;
        const inRange = isWithinInterval(new Date(row.original.due_date), {
          start: filterObj?.from,
          end: filterObj?.to,
        });

        return inRange;
      },
    },
    {
      accessorKey: "event",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Event
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => {
        console.log("row.getValue", row.getValue("event"));
        return <div>{row.getValue("event")}</div>;
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
      filterFn: (row, column, filter: { to: number; from: number }) => {
        const amount = row.original.amount;
        if (!filter) return true;

        if (!isNaN(filter.to) && !isNaN(filter.from)) {
          if (filter.to > filter.from) {
            return amount > filter.from && amount < filter.to;
          } else {
            return amount > filter.to && amount < filter.from;
          }
        } else {
          return true;
        }
      },
    },
    {
      accessorKey: "pay_vai",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Pay mode
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => {
        return <div className="capitalize">{row.getValue("pay_vai")}</div>;
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
        const status = row.getValue("status");
        return (
          <div
            className={clsx({
              "relative capitalize flex gap-1 items-center before:content-['']  before:h-2 before:w-2 before:rounded-full":
                true,
              "text-green-600 hover:text-green-600 before:bg-green-600":
                status === "paid",
              "text-pink-700 hover:text-pink-700 before:bg-pink-700":
                status === "overdue",
              "text-gray-400 before:bg-gray-400 hover:text-gray-400 ":
                status === "draft",
              "text-yellow-600 hover:text-yellow-600 before:bg-yellow-600":
                status === "pending",
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
    cell: ({ row }: any) => {
      return <Actions row={row} />;
    },
  };

  {
    showAction && columns.push(actionColumn);
  }

  return parsedInvoices.length > 0 ? (
    <CustomTable
      data={[...parsedInvoices]}
      columns={columns}
      extraFilters={ExtraFilters}
    />
  ) : (
    <p className="text-base text-center">No invoice exist</p>
  );
};

export default Invoices;
