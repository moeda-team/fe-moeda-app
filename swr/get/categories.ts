import { API_URL, OUTLET_ID } from "@/services";
import useSWR from "swr";
import { fetcher } from "../fetcher";

interface CategoryResponse {
  data: {
    [key: string]: any;
  };
}

export const useCategories = () => {
  const { data, error, isLoading } = useSWR<CategoryResponse>(`${API_URL}/menus/categories/${OUTLET_ID}`, fetcher);

  return {
    categories: data?.data ?? {},
    errorCategories: error,
    isLoadingCategories: isLoading,
  };
};
