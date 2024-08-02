"use client";
import React, { useEffect, useState } from "react";
import { getTemplateById } from "../utils";
import TemplateEditor from "./template-editor";
import PdfContainer from "./pdf-container";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

const TemplateContainer = ({ id }: { id: string }) => {
  const [template, setTemplate] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const getTemplate = await getTemplateById(id);
      setTemplate(getTemplate);
    }
    fetchData();
  }, [id]);

  const [isDocumentPdfLoaded, setIsDocumentPdfLoaded] = useState(false);

  if (!template) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <h1 className="mt-4 truncate text-2xl font-semibold md:text-3xl">
        {template?.name}
      </h1>
      <div className="mt-2.5 w-full flex items-center justify-between">
        <div className="flex items-center">
          <Lock className="mr-2 inline-block h-4 w-4" />
          <p>Private</p>
        </div>
        <Button variant={"outline"}>Create Direct Link</Button>
      </div>
      <div className={"grid w-full grid-cols-12 gap-8 mt-6"}>
        <PdfContainer
          setIsDocumentPdfLoaded={setIsDocumentPdfLoaded}
          template={template}
        />
        <TemplateEditor
          isDocumentPdfLoaded={isDocumentPdfLoaded}
          template={template}
          setTemplate={setTemplate}
          id={id}
        />
      </div>
    </>
  );
};

export default TemplateContainer;
