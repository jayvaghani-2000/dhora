import { useSearchParams } from "next/navigation";

export const useGetAllSearchParams = () => {
  const searchParams = useSearchParams();
  const params: Record<string, string> = {};

  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }

  return params;
};
