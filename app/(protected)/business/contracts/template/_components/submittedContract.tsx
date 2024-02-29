"use client";

import React, { useState } from "react";
import { getSubmittedContractResponseType } from "@/actions/_utils/types.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ColumnDef } from "@tanstack/react-table";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { deleteSubmittedContracts } from "@/actions/(protected)/contracts/deleteSubmittedContract";
import { Input } from "@/components/ui/input";
import { formatDate, searchTableData } from "@/lib/common";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { CustomTable } from "@/components/shared/custom-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type propType = { templates: getSubmittedContractResponseType["data"] };

const SubmittedContract = (props: propType) => {
  const { templates } = props;

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleDeleteTemplate = async (id: string) => {
    setLoading(true);
    await deleteSubmittedContracts(id);
    setLoading(false);
  };

  const parsedTemplate = templates!.map(i => ({
    name: i.template.name,
    submitter_email: i.submitters[0].email,
    status: i.submitters[0].status,
    sent_on: formatDate(i.submitters[0].sent_at),
    id: String(i.id),
  }));

  const columns: ColumnDef<(typeof parsedTemplate)[0]>[] = [
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

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const rowObj = row.original;

        return (
          <Button
            variant="outline"
            className="p-2"
            disabled={loading}
            onClick={() => {
              handleDeleteTemplate(rowObj.id);
            }}
          >
            <RiDeleteBin6Line size={24} color="#b6b6b6" />
          </Button>
        );
      },
    },
  ];

  return parsedTemplate.length > 0 ? (
    <CustomTable data={[...parsedTemplate]} columns={columns} />
  ) : null;
};

export default SubmittedContract;
