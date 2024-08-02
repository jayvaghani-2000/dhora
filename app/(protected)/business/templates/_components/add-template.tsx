"use client";

import React from "react";
import { toast } from "@/components/ui/use-toast";
import { createTemplate } from "@/actions/(protected)/business/templates";
import { base64 } from "@scure/base";
import { useRouter } from "next/navigation";
import { DocumentDropzone } from "./document-dropzone";
import { FilePlus, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AddTemplate = () => {
  const navigate = useRouter();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <FilePlus className="-ml-1 mr-2 h-4 w-4" />
          New Template
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-xl">
        <DialogHeader>
          <DialogTitle>New Template</DialogTitle>
          <DialogDescription>
            Templates allow you to quickly generate documents with pre-filled
            recipients and fields.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <DocumentDropzone
            className="h-[40vh]"
            onDrop={async file => {
              try {
                const contents = await file.arrayBuffer();

                const binaryData = new Uint8Array(contents);

                const asciiData = base64.encode(binaryData);

                const response = await createTemplate({
                  name: file.name,
                  data: asciiData,
                });

                if (response.success) {
                  toast({
                    title: "Success",
                    description: "Document uploaded successfully.",
                  });
                  navigate.push(`/business/templates/${response.data.id}`);
                }
              } catch (error) {
                toast({
                  title: "Error",
                  description: "An error occurred while loading the document.",
                  variant: "destructive",
                });
              }
            }}
            type="template"
          />

          {false && (
            <div className="bg-background/50 absolute inset-0 flex items-center justify-center rounded-lg">
              <Loader className="text-muted-foreground h-12 w-12 animate-spin" />
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTemplate;
