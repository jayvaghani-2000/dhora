import { LazyPDFViewer } from "@/components/shared/lazy-pdf-viewer";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

interface PdfContainerPropsTypes {
  template: any;
  setIsDocumentPdfLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

const PdfContainer = ({
  template,
  setIsDocumentPdfLoaded,
}: PdfContainerPropsTypes) => {
  return (
    <Card className="relative col-span-12 rounded-xl before:rounded-xl lg:col-span-6 xl:col-span-7">
      <CardContent className="p-2">
        <LazyPDFViewer
          onDocumentLoad={() => setIsDocumentPdfLoaded(true)}
          documentData={template?.data}
        />
      </CardContent>
    </Card>
  );
};

export default PdfContainer;
