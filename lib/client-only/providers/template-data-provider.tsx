import React, { useEffect, useState } from "react";
import { getTemplates } from "@/actions/(protected)/business/templates";
import { useGetAllSearchParams } from "../hooks/use-get-all-search-params";

export const TemplateDataContext = React.createContext<{
  data: any;
  state: "fetched" | "fetching";
  refetch: () => void;
}>({
  data: undefined,
  state: "fetching",
  refetch: () => {},
});

function TemplateDataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"fetched" | "fetching">("fetching");
  const [data, setData] = useState<any>(undefined);
  const params = useGetAllSearchParams();

  useEffect(() => {
    setState("fetching");
  }, [JSON.stringify(params)]);

  useEffect(() => {
    if (state === "fetching") {
      const fetchData = async () => {
        const fetchedData = await getTemplates({
          perPage: Number(params?.perPage ?? 10),
          page: Number(params?.page ?? 1),
        });
        setData(fetchedData);
        setState("fetched");
      };
      fetchData();
    }
  }, [state]);

  function refetch() {
    setState("fetching");
  }

  return (
    <TemplateDataContext.Provider
      value={{
        data,
        state,
        refetch,
      }}
    >
      {children}
    </TemplateDataContext.Provider>
  );
}

export default React.memo(TemplateDataProvider);
