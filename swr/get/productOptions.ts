import { API_URL } from "@/services";
import useSWR from "swr";
import { fetcher } from "../fetcher";

interface ProductOptionsResponse {
  data: any;
}

export const useProductOptions = () => {
  const { data, error, isLoading } = useSWR<ProductOptionsResponse>(`${API_URL}/menus/options`, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    productOptions: data?.data ?? {},
    errorProductOptions: error,
    isLoadingProductOptions: isLoading,
  };
};
