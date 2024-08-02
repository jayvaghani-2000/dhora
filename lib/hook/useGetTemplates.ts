"use client";
import { getTemplates } from "@/actions/(protected)/business/templates";
import { useEffect, useState } from "react";

export const useGetTemplates = () => {
  const [state, setState] = useState<"fectched" | "fetching">("fetching");

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (state === "fetching") {
      const fetchData = async () => {
        const data = await getTemplates();
        setData(data);
        setState("fectched");
      };
      fetchData();
    }
  }, [state]);

  function refetch() {
    setState("fetching");
  }

  return { data, state, refetch };
};
