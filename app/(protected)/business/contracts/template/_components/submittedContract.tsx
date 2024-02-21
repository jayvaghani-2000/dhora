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
import { MdOutlineEdit } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { deleteSubmittedContracts } from "@/actions/(protected)/(contracts)/deleteSubmittedContract";

type propType = { templates: getSubmittedContractResponseType["data"] };

const SubmittedContract = (props: propType) => {
  const { templates } = props;
  const [loading, setLoading] = useState(false);

  const parsedTemplate = templates!.data.map(i => ({
    name: i.template.name,
    submitter_email: i.email,
    status: i.status,
    sent_on: i.sent_at,
    id: i.submission_id,
  }));

  const handleDeleteTemplate = async (id: number) => {
    setLoading(true);
    await deleteSubmittedContracts(id);
    setLoading(false);
  };

  return (
    <div className="w-[calc(100dvw-40px)] md:w-auto">
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
          {parsedTemplate.map(temp => (
            <TableRow key={temp.id}>
              <TableCell className="font-medium">{temp.name}</TableCell>
              <TableCell>{temp.submitter_email}</TableCell>
              <TableCell>{new Date(temp.sent_on).toDateString()}</TableCell>
              <TableCell>{temp.status}</TableCell>
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
                      <BsThreeDotsVertical size={24} color="#b6b6b6" />
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
  );
};

export default SubmittedContract;
