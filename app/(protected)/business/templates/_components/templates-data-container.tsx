import React, { useContext } from "react";
import { TemplatesDataTable } from "./data-table-templates";
import { TemplateDataContext } from "@/lib/client-only/providers/template-data-provider";

const TemplatesDataContainer = () => {
  const { data } = useContext(TemplateDataContext);

  return (
    <div className="mt-10">
      <TemplatesDataTable
        templates={data?.data.templates ?? []}
        perPage={0}
        page={0}
        totalPages={0}
      />
    </div>
  );
};

export default TemplatesDataContainer;
