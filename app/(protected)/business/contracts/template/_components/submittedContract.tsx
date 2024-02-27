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
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { deleteSubmittedContracts } from "@/actions/(protected)/contracts/deleteSubmittedContract";
import { Input } from "@/components/ui/input";
import { formatDate, searchTableData } from "@/lib/common";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";

type propType = { templates: getSubmittedContractResponseType["data"] };

const SubmittedContract = (props: propType) => {
  const { templates } = props;

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleDeleteTemplate = async (id: number) => {
    setLoading(true);
    await deleteSubmittedContracts(id);
    setLoading(false);
  };

  const parsedTemplate = templates!.map(i => ({
    name: i.template.name,
    submitter_email: i.submitters[0].email,
    status: i.submitters[0].status,
    sent_on: formatDate(i.submitters[0].sent_at),
    id: i.id,
  }));

  const filteredTemplate = searchTableData(parsedTemplate, search);

  return parsedTemplate.length > 0 ? (
    <div className="w-[calc(100dvw-40px)] md:w-auto">
      <Input
        className="ml-auto max-w-full w-full md:w-[300px]"
        placeholder="Search..."
        onChange={e => {
          setSearch(e.target.value.trim());
        }}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Sent on</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTemplate.map(temp => (
            <TableRow key={temp.id}>
              <TableCell className="font-medium">{temp.name}</TableCell>
              <TableCell>{temp.submitter_email}</TableCell>
              <TableCell>{temp.sent_on}</TableCell>
              <TableCell>
                <Badge
                  className={clsx({
                    "capitalize text-white": true,
                    "bg-green-600 hover:bg-green-600":
                      temp.status === "completed",
                    "bg-pink-700 hover:bg-pink-700 ": temp.status === "sent",
                    "bg-yellow-600 hover:bg-yellow-600":
                      temp.status === "opened",
                  })}
                >
                  {temp.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right hidden md:flex gap-5 justify-end ">
                <button
                  disabled={loading}
                  onClick={() => {
                    handleDeleteTemplate(temp.id);
                  }}
                >
                  <RiDeleteBin6Line size={24} color="#b6b6b6" />
                </button>
              </TableCell>
              <TableCell className="text-right md:hidden ">
                <Popover>
                  <PopoverTrigger asChild>
                    <button>
                      <BsThreeDotsVertical size={18} color="#b6b6b6" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-24 p-2 flex flex-col gap-2"
                    align="end"
                  >
                    <button
                      className="flex gap-2 items-center font-bold text-xs "
                      disabled={loading}
                      onClick={() => {
                        handleDeleteTemplate(temp.id);
                      }}
                    >
                      <RiDeleteBin6Line size={18} color="#b6b6b6" /> Delete
                    </button>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ) : null;
};

export default SubmittedContract;
