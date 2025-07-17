import { API_URL, OUTLET_ID } from "@/services";
import useSWR from "swr";
import { fetcher } from "../fetcher";

interface BestSellerResponse {
  data: any;
}

export const useBestSeller = () => {
  const { data, error, isLoading } = useSWR<BestSellerResponse>(
    `${API_URL}/menus/main/list/best/${OUTLET_ID}`,
    fetcher
  );

  return {
    bestSeller: data?.data ?? {},
    errorBestSeller: error,
    isLoadingBestSeller: isLoading,
  };
};
