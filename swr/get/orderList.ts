import { API_URL, OUTLET_ID } from "@/services";
import useSWR from "swr";
import { fetcher } from "../fetcher";

interface OrderListResponse {
  data: any;
}

export const useOrderList = () => {
  const { data, error, isLoading } = useSWR<OrderListResponse>(
    `${API_URL}/transactions/order/status/${OUTLET_ID}`,
    fetcher
  );

  return {
    orderList: data?.data ?? {},
    errorOrderList: error,
    isLoadingOrderList: isLoading,
  };
};
