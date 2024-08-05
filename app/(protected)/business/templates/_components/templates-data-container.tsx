import React, { useContext } from "react";
import { TemplatesDataTable } from "./data-table-templates";
import { TemplateDataContext } from "@/lib/client-only/providers/template-data-provider";
import { useGetAllSearchParams } from "@/lib/client-only/hooks/use-get-all-search-params";

const TemplatesDataContainer = () => {
  const { data } = useContext(TemplateDataContext);
  const params = useGetAllSearchParams();

  return (
    <div className="mt-10">
      <TemplatesDataTable
        templates={data?.data?.templates ?? []}
        perPage={Number(params?.perPage ?? 10)}
        page={Number(params?.page ?? 1)}
        totalPages={data?.data?.totalPages ?? 1}
      />
    </div>
  );
};

export default TemplatesDataContainer;
